use async_recursion::async_recursion;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, IntoActiveModel, ModelTrait,
    QueryFilter, QueryOrder, QuerySelect, TryIntoModel,
};
use sea_orm::ActiveValue::Set;
use sea_query::{Condition, Expr};
use tracing::{debug, info};
use uuid::Uuid;

use cerium::client::Client;
use cerium::client::driver::web::WebDriver;
use engine::controller::case::CaseController;
use entity::prelude::ActiveExecutionRequest;
use entity::prelude::case::{Column, Entity, Model};
use entity::prelude::case_block::{
    ActiveModel as BlockActiveModel, Column as BlockColumn, Entity as BlockEntity,
    Model as BlockModel, SelfReferencingLink,
};
use entity::test::history;
use entity::test::ui::{ExecutionRequest, request};
use entity::test::ui::request::{ExecutionKind, ExecutionStatus, ExecutionType};

use crate::error::{InternalResult, OrcaRepoError};
use crate::server::session::OrcaSession;
use crate::service::app::history::HistoryService;

pub(crate) struct CaseService(OrcaSession, Client, Uuid);

impl CaseService {
    pub fn new(session: OrcaSession, cli: Client, app_id: Uuid) -> Self {
        Self(session, cli, app_id)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    /// list all the test suites in the Orca Application
    pub(crate) async fn list_cases(&self) -> InternalResult<Vec<Model>> {
        let cases = Entity::find()
            .filter(Column::AppId.eq(self.2))
            .order_by_asc(Column::Name)
            .all(self.trx())
            .await?;
        Ok(cases)
    }

    /// create_case - this will create new Application in Orca
    pub async fn create_case(&self, mut app: Model) -> InternalResult<Model> {
        app.id = Uuid::new_v4();
        app.app_id = self.2;
        let app = app.into_active_model();
        let result = app.insert(self.trx()).await?;
        Ok(result)
    }

    #[async_recursion]
    pub async fn query_case(
        &self,
        case_id: Uuid,
        parent_id: Option<Uuid>,
    ) -> InternalResult<Vec<BlockModel>> {
        let mut condition = Condition::all().add(BlockColumn::CaseId.eq(case_id));
        if parent_id.is_some() {
            condition = condition.add(BlockColumn::ParentId.eq(parent_id.unwrap()))
        } else {
            condition = condition.add(BlockColumn::ParentId.is_null())
        }
        let case_blocks = BlockEntity::find()
            .filter(condition)
            .order_by_asc(BlockColumn::ExecutionOrder)
            .find_with_linked(SelfReferencingLink)
            .all(self.trx())
            .await?;
        let mut cases: Vec<BlockModel> = vec![];
        for (mut case, childs) in case_blocks {
            let mut childrens: Vec<BlockModel> = vec![];
            for mut child_case in childs {
                let child_case_id = child_case.id;
                let _childrens = self.query_case(case_id, Some(child_case_id)).await?;
                child_case.children = Some(_childrens);
                childrens.push(child_case);
            }
            case.children = Some(childrens);
            cases.push(case);
        }
        // let cases : Vec<BlockModel> = case_blocks.into_iter().map(|(mut case, childs)| async {
        //     // for mut child_case in childs {
        //     //     let child_case_id = child_case.id;
        //     //     let _childrens = self.query_case(case_id, Some(child_case_id)).await?;
        //     //     child_case.children = Some(_childrens);
        //     // }
        //     let _childs = childs.iter().map(|mut child_case| async {
        //         let child_case_id = child_case.id;
        //         let _childrens = self.query_case(case_id, Some(child_case_id)).await?;
        //         child_case.children = Some(_childrens);
        //         return child_case;
        //     }).collect();
        //     case.children = Some(childs);
        //     case
        // }).collect();
        return Ok(cases);
    }

    /// get_case_info - Get Case Info
    pub async fn get_case_info(&self, case_id: Uuid) -> InternalResult<Model> {
        let case = Entity::find_by_id(case_id).one(self.trx()).await?;
        if case.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "Test Case".to_string(),
                case_id.to_string(),
            ))?;
        }
        let mut case = case.unwrap();
        let cases: Vec<BlockModel> = self.query_case(case_id, None).await?;

        // let condition = Condition::all()
        //     .add(BlockColumn::CaseId.eq(case_id))
        //     .add(BlockColumn::ParentId.is_null());
        // let case_blocks = BlockEntity::find()
        //     // .filter(BlockColumn::CaseId.eq(case_id))
        //     .filter(condition)
        //     .order_by_asc(BlockColumn::ExecutionOrder)
        //     .find_with_linked(SelfReferencingLink)
        //     .all(self.trx())
        //     .await?;
        // let cases : Vec<BlockModel> = case_blocks.into_iter().map(|(mut case, childs)| {
        //     let _childs = childs.into_iter().map(|(case)|{
        //         let case_id = case.id;
        //
        //     });
        //     case.children = Some(childs);
        //     case
        // }).collect();
        info!("{:#?}", cases);

        // case_blocks.clone().into_iter().for_each(|case| {
        //     let d = block_on(case.find_linked(SelfReferencingLink).all(self.trx())).expect("erro");
        //     info!("{:?}", d);
        //     info!("{:?}", case);
        //
        // });

        case.case_execution = Some(serde_json::to_value(cases)?);
        Ok(case)
    }

    /// batch_update_case_block - update Case Block
    pub async fn batch_update_case_block(
        &self,
        case_id: Uuid,
        mut body: Vec<BlockModel>,
    ) -> InternalResult<()> {
        let case_blocks: Vec<BlockActiveModel> = body
            .into_iter()
            .map(|mut block| {
                block.case_id = case_id.clone();
                block.into_active_model()
            })
            .collect();
        let blocks = BlockEntity::insert_many(case_blocks)
            .exec(self.trx())
            .await?;
        Ok(())
    }

    /// update_case_block - this will update the single case block
    async fn update_case_block(
        &self,
        _case_id: Uuid,
        case_block_id: Uuid,
        body: BlockModel,
    ) -> InternalResult<BlockModel> {
        let case_block = BlockEntity::find_by_id(case_block_id)
            .one(self.trx())
            .await?;
        if case_block.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "Test Case Block".to_string(),
                case_block_id.to_string(),
            ))?;
        }
        let mut _block = case_block.unwrap().into_active_model();
        _block.kind = Set(body.kind.to_owned());
        _block.type_field = Set(body.type_field.to_owned());
        _block.reference = Set(body.reference.to_owned());
        _block.parent_id = Set(body.parent_id.to_owned());
        let result = _block.save(self.trx()).await?;
        Ok(result.try_into_model()?)
    }

    /// run - this will run the single tes case
    pub async fn run(&self, case_id: Uuid) -> InternalResult<()> {
        let ui_driver = WebDriver::default().await?;
        let controller = CaseController::new(self.trx(), ui_driver.clone(), self.1.clone());
        controller.run(case_id, true).await?;
        ui_driver.quit().await?;

        Ok(())
    }

    /// push_into_index - This will Append New Block to the code for spe
    async fn push_into_index(
        &self,
        case_id: Uuid,
        mut body: BlockModel,
        parent: Option<Uuid>,
        index: Option<i32>,
    ) -> InternalResult<BlockModel> {
        let mut _filter = Condition::all().add(BlockColumn::CaseId.eq(case_id));

        if parent.is_some() {
            _filter = _filter.add(BlockColumn::ParentId.eq(parent.unwrap()));
        }

        let _index: i32 = match index {
            Some(x) => x,
            _ => {
                let mut i = 1;
                let blocks = BlockEntity::find()
                    .filter(_filter.clone())
                    .all(self.trx())
                    .await?;
                if let Some(b) = blocks.last() {
                    i = b.execution_order + 1;
                }
                i
            }
        };
        _filter = _filter.add(BlockColumn::ExecutionOrder.gte(index));

        let update_result = BlockEntity::update_many()
            .col_expr(
                BlockColumn::ExecutionOrder,
                Expr::expr(Expr::col(BlockColumn::ExecutionOrder).if_null(0)).add(1),
            )
            .filter(_filter)
            .exec(self.trx())
            .await?;
        info!(" Updated result - {:?}", update_result.rows_affected);
        body.id = Uuid::new_v4();
        body.case_id = case_id;
        let _case = body.clone().into_active_model();
        debug!("{:?}", _case);
        let result = _case.insert(self.trx()).await?;
        Ok(result)
    }

    /// push_block - This will Append New Case
    pub(crate) async fn push_block(
        &self,
        case_id: Uuid,
        mut body: BlockModel,
        index: Option<i32>,
        parent: Option<Uuid>,
    ) -> InternalResult<BlockModel> {
        let mut _filter = Condition::all().add(BlockColumn::CaseId.eq(case_id));
        if parent.is_some() {
            _filter = _filter.add(BlockColumn::ParentId.eq(parent.unwrap()));
        }
        let blocks = BlockEntity::find()
            .filter(_filter.clone())
            .order_by_desc(BlockColumn::ExecutionOrder)
            .limit(1)
            .all(self.trx())
            .await?;
        let mut last_index = 1;
        if let Some(last_item) = blocks.last() {
            last_index = last_item.execution_order + 1;
        }
        let _index: i32 = match index {
            Some(x) => {
                let i = if x > last_index { last_index } else { x };
                i
            }
            _ => last_index,
        };
        _filter = _filter.add(BlockColumn::ExecutionOrder.gte(_index));

        let update_result = BlockEntity::update_many()
            .col_expr(
                BlockColumn::ExecutionOrder,
                Expr::expr(Expr::col(BlockColumn::ExecutionOrder).if_null(0)).add(1),
            )
            .filter(_filter)
            .exec(self.trx())
            .await?;
        body.id = Uuid::new_v4();
        body.case_id = case_id;
        body.execution_order = _index;
        let _case = body.clone().into_active_model();
        info!("{:?}", _case);
        let result = _case.insert(self.trx()).await?;
        Ok(result)
    }
}
