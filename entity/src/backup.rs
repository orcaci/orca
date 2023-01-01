use serde::{Serialize, Deserialize};

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Case {
    pub id: String,
    pub name: String,
    pub actors: Vec<CaseBlock>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CaseBlock {
    pub id: String,
    pub execution_order: i64,
    pub kind: String,
    pub type_field: String,
    pub reference: String,
    // pub filter: Option<Filter>,
    pub actors: Vec<Actor>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Filter {
    pub scenario: String,
    pub case: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Actor {
    pub execution_order: i64,
    pub action_kind: String,
    pub action_reference: String,
    pub data_binding: Vec<DataBinding>,
    pub description: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct DataBinding {
    pub key: String,
    pub value: String,
}



//!-------------------------------------------------
//!-------------------------------------------------
//!-------------------------------------------------
//!-------------------------------------------------



use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all="camelCase")]
pub enum ATargetKind{
    Css,
    Id,
    Xpath,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all="camelCase")]
pub enum ADataKind{
    Runtime,
    Static,
}


#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all="camelCase")]
pub enum ActionKind{
    Click,
    Enter,
    DoubleClick,
}


#[derive(Serialize, Deserialize, Debug)]
pub struct ActionTarget {
    #[serde(rename = "type")]
    pub kind: ATargetKind,
    pub value: String,
}

/// ActionData - object to Have information of the datatype
#[derive(Serialize, Deserialize, Debug)]
pub struct ActionData {
    #[serde(rename = "type")]
    pub kind: ADataKind,
    pub value: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Action {
    #[serde(rename = "type")]
    pub kind: ActionKind,
    pub description: String,
    pub target: ActionTarget,
    pub data: Option<ActionData>
}


#[derive(Serialize, Deserialize, Debug)]
pub struct ActionGroup {
    pub name: String,
    pub description: Option<String>,
    pub actions: Vec<Action>
}


impl ActionGroup {

}

/// Evaluate action type
/// 1. if enter
///     1.1 find css using ActionTarget
///     1.2 fill up target using ActionData
// pub fn evaluate_action_type() {
//     let action = Action {
//         description: "test descritpion".parse().unwrap(),
//         kind: "enter".parse().unwrap(),
//         target: ActionTarget {
//             value: "css".parse().unwrap(),
//             kind: "#email".parse().unwrap(),
//         },
//         data: ActionData {
//             kind: "harcode".to_string(),
//             value: "manikandantest".to_string()
//         },
//     };
//
//     let action_type = action.kind;
//
// }



// pub mod driver;
// mod ui;
//
// extern crate entity;



#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
