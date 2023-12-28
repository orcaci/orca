use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, IntoActiveModel, QueryFilter, QueryOrder, QuerySelect};
use sea_query::{Condition, Expr};
use tracing::info;
use uuid::Uuid;

use entity::test::ui::suit::suite::{Column, Entity, Model};
use entity::test::ui::suit::suite_block::{ActiveModel, Column as BlockColumn, Entity as BlockEntity, Model as BlockModel};

use crate::error::{InternalResult, OrcaRepoError};
use crate::server::session::OrcaSession;

pub(crate) struct SuitService(OrcaSession, Uuid);

impl SuitService {
    pub fn new(session: OrcaSession, app_id: Uuid) -> Self {
        Self(session, app_id)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    /// list all the test suites in the Orca Application
    pub(crate) async fn list_suites(&self) -> InternalResult<Vec<Model>> {
        let suites = Entity::find().filter(Column::AppId.eq(self.1))
            .order_by_asc(Column::Name)
            .all(self.trx()).await?;
        Ok(suites)
    }

    pub(crate) async fn create_suit(&self, mut body: Model) -> InternalResult<Model> {
        body.id = Uuid::new_v4();
        body.app_id = self.1;
        let _case = body.into_active_model();
        let result = _case.insert(self.trx()).await?;
        return Ok(result)
    }

    /// batch_update_suite_block - update suite Block
    pub(crate) async fn batch_update_suite_block(&self, suite_id: Uuid,
                                      mut body: Vec<BlockModel>) -> InternalResult<()> {
        let suit_blocks: Vec<ActiveModel> = body.into_iter().map(|mut block|{
            block.suite_id = suite_id.clone();
            block.into_active_model()
        }).collect();
        let blocks = BlockEntity::insert_many(suit_blocks)
            .exec(self.trx()).await?;
        Ok(())
    }

    /// get_suits_info - Get Suite Info and the batch information with the list of block
    pub(crate) async fn get_suite_info(&self, suite_id: Uuid) -> InternalResult<Model> {
        let suite = Entity::find_by_id(suite_id)
            .one(self.trx()).await?;
        if suite.is_none() {
            return Err(OrcaRepoError::ModelNotFound("Test Suite".to_string(), suite_id.to_string()))?;
        }
        let mut suite = suite.unwrap();
        let suite_blocks = BlockEntity::find()
            .filter(BlockColumn::SuiteId.eq(suite_id))
            .order_by_asc(BlockColumn::ExecutionOrder)
            .all(self.trx()).await?;
        suite.suite_execution = Some(serde_json::to_value(suite_blocks)?);
        Ok(suite)
    }

    /// push_block - This will Append New Block to the code for spe
    pub(crate) async fn push_block(&self, suite_id: Uuid, mut body: BlockModel, index: Option<i32>) -> InternalResult<BlockModel> {

        let mut _filter = Condition::all().add(BlockColumn::SuiteId.eq(suite_id));
        // if param.parent.is_some() {
        //     _filter = _filter.add(case_block::Column::ParentId.eq(param.parent.unwrap()));
        // }
        let blocks =  BlockEntity::find().filter(_filter.clone())
            .order_by_desc(BlockColumn::ExecutionOrder).limit(1)
            .all(self.trx()).await?;
        let mut last_index = 1;
        if let Some(last_item) = blocks.last() {
            last_index = last_item.execution_order + 1;
        }
        let _index : i32 = match index {
            Some(x) => {
                let i = if x > last_index { last_index } else {x};
                i
            },
            _ => last_index
        };
        _filter = _filter.add(BlockColumn::ExecutionOrder.gte(_index));

        let update_result = BlockEntity::update_many()
            .col_expr(BlockColumn::ExecutionOrder, Expr::expr(Expr::col(BlockColumn::ExecutionOrder).if_null(0)).add(1))
            .filter(_filter)
            .exec(self.trx())
            .await?;
        body.id = Uuid::new_v4();
        body.suite_id = suite_id;
        body.execution_order = _index;
        let _suite = body.clone().into_active_model();
        info!("{:?}", _suite);
        let result = _suite.insert(self.trx()).await?;
        Ok(result)
    }
}