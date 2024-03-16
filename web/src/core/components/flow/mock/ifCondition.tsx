export const IF_CONDITION = [
  {
    id: "fcb03ff7-4640-4afe-a05b-1d0e08ee9594",
    execution_order: 1,
    kind: "Reference",
    type_field: "ActionGroup",
    reference: "cb2f6a96-effe-4bc7-adae-c45578cd2a56",
    parent_id: null,
    case_id: "731453aa-95a5-4180-be0d-c211a1e92aad"
  },
  {
    id: "fcb03ff7-4640-4afe-a05b-if",
    execution_order: 2,
    kind: "Reference",
    type_field: "Condition",
    reference: null,
    parent_id: null,
    case_id: "731453aa-95a5-4180-be0d-c211a1e92aad"
  },
  {
    id: "fcb03ff7-4640-4afe-a05b-if-yes",
    execution_order: 1,
    kind: "Reference",
    type_field: "YesCondition",
    reference: null,
    parent_id: "fcb03ff7-4640-4afe-a05b-if",
    case_id: "731453aa-95a5-4180-be0d-c211a1e92aad"
  },
  {
    id: "fcb03ff7-4640-4afe-a05b-if-no",
    execution_order: 2,
    kind: "Reference",
    type_field: "NoCondition",
    reference: null,
    parent_id: "fcb03ff7-4640-4afe-a05b-if",
    case_id: "731453aa-95a5-4180-be0d-c211a1e92aad"
  },
  {
    id: "fcb03ff7-4640-4afe-a05b-sub-if",
    execution_order: 1,
    kind: "Reference",
    type_field: "ActionGroup",
    reference: "cb2f6a96-effe-4bc7-adae-c45578cd2a56",
    parent_id: "fcb03ff7-4640-4afe-a05b-if-yes",
    case_id: "731453aa-95a5-4180-be0d-c211a1e92aad"
  }
];
