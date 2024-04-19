use std::cmp::{max, min};

use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, IntoActiveModel, ModelTrait, QueryFilter, QueryOrder, QuerySelect, TryIntoModel};
use sea_orm::ActiveValue::Set;
use sea_orm_migration::SchemaManager;
use sea_query::{Alias, Condition, Expr, Table};
use tracing::{debug, info};
use uuid::Uuid;

use cerium::client::Client;
use cerium::client::driver::web::WebDriver;
use engine::controller::case::CaseController;
use engine::controller::suite::SuiteController;
use entity::test::ui::case::case::{Column as CaseColumn, Entity as CaseEntity, Model as CaseModel};
use entity::test::ui::suit::suite::{Column, Entity, Model};
use entity::test::ui::suit::suite_block::{
    ActiveModel, Column as BlockColumn, Entity as BlockEntity, Model as BlockModel,
};

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
        let suites = Entity::find()
            .filter(Column::AppId.eq(self.1))
            .order_by_asc(Column::Name)
            .all(self.trx())
            .await?;
        Ok(suites)
    }

    pub(crate) async fn create_suit(&self, mut body: Model) -> InternalResult<Model> {
        body.id = Uuid::new_v4();
        body.app_id = self.1;
        let _case = body.into_active_model();
        let result = _case.insert(self.trx()).await?;
        return Ok(result);
    }

    /// delete - this will delete Suite in Application in Orca
    pub async fn delete(&self, suite_id: Uuid) -> InternalResult<()> {
        let suite = Entity::find_by_id(suite_id).one(self.trx()).await?;
        if suite.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "Suite".to_string(),
                suite_id.to_string(),
            ))?;
        }
        let suite = suite.unwrap();
        suite.delete(self.trx()).await?;
        Ok(())
    }

    /// batch_update_suite_block - update suite Block
    pub(crate) async fn batch_update_suite_block(
        &self,
        suite_id: Uuid,
        body: Vec<BlockModel>,
    ) -> InternalResult<()> {
        let suit_blocks: Vec<ActiveModel> = body
            .into_iter()
            .map(|mut block| {
                if block.id.is_nil() {
                    block.id = Uuid::new_v4();
                }
                block.suite_id = suite_id.clone();
                block.into_active_model()
            })
            .collect();
        let _blocks = BlockEntity::insert_many(suit_blocks)
            .exec(self.trx())
            .await?;
        Ok(())
    }

    /// get_suits_info - Get Suite Info and the batch information with the list of block
    pub(crate) async fn get_suite_info(&self, suite_id: Uuid) -> InternalResult<Model> {
        let suite = Entity::find_by_id(suite_id).one(self.trx()).await?;
        if suite.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "Test Suite".to_string(),
                suite_id.to_string(),
            ))?;
        }
        let mut suite = suite.unwrap();
        let suite_blocks = BlockEntity::find()
            .filter(BlockColumn::SuiteId.eq(suite_id))
            .order_by_asc(BlockColumn::ExecutionOrder)
            .all(self.trx())
            .await?;
        let mut result = vec![];
        for mut item in suite_blocks {
            if item.reference.is_some() {
                let _ref = CaseEntity::find_by_id(item.reference.unwrap())
                    .one(self.trx())
                    .await?;
                if _ref.is_some() {
                    let r = _ref.clone().unwrap();
                    info!("{:#?}", r);
                    item.name = Some(r.clone().name.clone());
                    item.description = r.description;
                }
            }
            result.push(item);
        }
        suite.suite_execution = Some(serde_json::to_value(result)?);
        Ok(suite)
    }

    /// push_block - This will Append New Block to the code for spe
    pub(crate) async fn push_block(
        &self,
        suite_id: Uuid,
        mut body: BlockModel,
        index: Option<i32>,
    ) -> InternalResult<BlockModel> {
        let mut _filter = Condition::all().add(BlockColumn::SuiteId.eq(suite_id));
        // if param.parent.is_some() {
        //     _filter = _filter.add(case_block::Column::ParentId.eq(param.parent.unwrap()));
        // }
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

        let _update_result = BlockEntity::update_many()
            .col_expr(
                BlockColumn::ExecutionOrder,
                Expr::expr(Expr::col(BlockColumn::ExecutionOrder).if_null(0)).add(1),
            )
            .filter(_filter)
            .exec(self.trx())
            .await?;
        body.id = Uuid::new_v4();
        body.suite_id = suite_id;
        body.execution_order = _index;
        let _suite = body.clone().into_active_model();
        info!("{:?}", _suite);
        let mut result = _suite.insert(self.trx()).await?;
        if result.reference.is_some() {
            let _ref = CaseEntity::find_by_id(result.reference.unwrap())
                .one(self.trx())
                .await?;
            if _ref.is_some() {
                let r = _ref.clone().unwrap();
                info!("{:#?}", r);
                result.name = Some(r.clone().name.clone());
                result.description = r.description;
            }
        }
        Ok(result)
    }

    /// delete_block - This will delete Block in the Suite
    pub(crate) async fn delete_block(
        &self,
        block_id: Uuid,
    ) -> InternalResult<()> {
        BlockEntity::delete_by_id(block_id).exec(self.trx()).await?;
        return Ok(());
    }


    /// reorder_block - this function will reorder the block to new location
    pub(crate) async fn reorder_block(
        &self,
        block_id: Uuid,
        location: i32,
    ) -> InternalResult<BlockModel> {
        let block = BlockEntity::find_by_id(block_id).one(self.trx()).await?;
        if block.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "Block".to_string(),
                block_id.to_string(),
            ))?;
        }
        let mut block = block.unwrap();
        let old_location = block.execution_order.clone();
        let mut _filter = Condition::all()
            .add(BlockColumn::SuiteId.eq(block.suite_id.clone()));
        let mut expr = Expr::expr(Expr::col(BlockColumn::ExecutionOrder).if_null(0)).sub(0);
        if location > old_location {
            _filter = _filter.add(BlockColumn::ExecutionOrder.gt(old_location))
                .add(BlockColumn::ExecutionOrder.lte(location));
            expr = Expr::expr(Expr::col(BlockColumn::ExecutionOrder).if_null(0)).sub(1);
        } else {
            _filter = _filter.add(BlockColumn::ExecutionOrder.lt(old_location))
                .add(BlockColumn::ExecutionOrder.gte(location));
            expr = Expr::expr(Expr::col(BlockColumn::ExecutionOrder).if_null(0)).add(1);
        }
        let _result = BlockEntity::update_many().col_expr(
            BlockColumn::ExecutionOrder,
            expr,
        ).filter(_filter).exec(self.trx()).await?;
        debug!("updated result {:?}", _result);
        let mut am_block = block.into_active_model();
        am_block.execution_order = Set(location);
        let result = am_block.save(self.trx()).await?.try_into_model()?;
        return Ok(result);
    }


    /// run - this will run the single testsuite
    pub async fn run(&self, client: Client, suite_id: Uuid) -> InternalResult<()> {
        let ui_driver = WebDriver::default().await?;
        let controller = SuiteController::new(self.trx(), ui_driver.clone(), client.clone());
        controller.run(suite_id, true).await?;
        ui_driver.quit().await?;
        Ok(())
    }
}
