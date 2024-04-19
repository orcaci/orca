use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, IntoActiveModel, NotSet,
    QueryFilter, QueryOrder, TryIntoModel,
};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Uuid;
use sea_query::Expr;
use tracing::info;

use entity::test::ui::action::action;
use entity::test::ui::action::action::{ActiveModel, Entity, Model};

use crate::error::{InternalResult, OrcaRepoError};
use crate::server::session::OrcaSession;

pub(crate) struct ActionService(OrcaSession);

impl ActionService {
    pub fn new(session: OrcaSession) -> Self {
        Self(session)
    }

    pub fn trx(&self) -> &DatabaseTransaction {
        self.0.trx()
    }

    /// get_actions - list all the Action Group in Specific Application in the Orca Application
    pub async fn get_actions(&self, group_id: Uuid) -> InternalResult<Vec<Model>> {
        let actions = action::Entity::find()
            .filter(action::Column::ActionGroupId.eq(group_id))
            .order_by_asc(action::Column::ExecutionOrder)
            .all(self.trx())
            .await?;
        Ok(actions)
    }

    /// create_action - this will create new Action Group in Application in Orca
    pub async fn create_action(&self, group_id: Uuid, mut action: Model) -> InternalResult<Model> {
        action.id = Uuid::new_v4();
        action.action_group_id = group_id;
        let action = action.into_active_model();
        let result = action.insert(self.trx()).await?;
        Ok(result)
    }

    /// update_action - this will update existing Action in Application in Orca
    pub async fn update_action(&self, action_id: Uuid, action: Model) -> InternalResult<Model> {
        let mut _action = action::Entity::find_by_id(action_id)
            .one(self.trx())
            .await?;
        if _action.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "Action".to_string(),
                action_id.to_string(),
            ))?;
        }
        let exist_action = _action.unwrap();
        let mut action = action.into_active_model();
        action.id = Set(action_id);
        action.action_group_id = Set(exist_action.action_group_id);
        let result = action.save(self.trx()).await?.try_into_model()?;
        Ok(result)
    }

    /// delete_action - this will delete Action for Action Group in Application in Orca
    pub async fn delete_action(&self, action_id: Uuid) -> InternalResult<()> {
        let action = action::Entity::find_by_id(action_id)
            .one(self.trx())
            .await?;
        if action.is_none() {
            return Err(OrcaRepoError::ModelNotFound(
                "Action".to_string(),
                action_id.to_string(),
            ))?;
        }
        let _action = action.unwrap();
        let action_obj: action::ActiveModel = _action.into();
        let action_order = action_obj.clone().execution_order.unwrap();
        action_obj.delete(self.trx()).await?;
        let update_result = action::Entity::update_many()
            .col_expr(
                action::Column::ExecutionOrder,
                Expr::expr(Expr::col(action::Column::ExecutionOrder).if_null(0)).add(1),
            )
            .filter(action::Column::ExecutionOrder.gt(action_order))
            .exec(self.trx())
            .await?;
        info!(
            "Updated the Action which have execution order gt {:?}, count - {:?}",
            action_order, update_result.rows_affected
        );
        Ok(())
    }

    /// batch_update_action - This will update batch Action Group in Application in Orca
    pub async fn batch_update_action(
        &self,
        group_id: Uuid,
        mut actions: Vec<Model>,
    ) -> InternalResult<Vec<Model>> {
        let mut result: Vec<Model> = vec![];
        for item in actions {
            let mut _item = item.into_active_model().reset_all();
            info!("For Input update for {:?}", _item);
            let item = _item.save(self.trx()).await?.try_into_model()?;
            result.push(item);
        }
        Ok(result)
    }
}
