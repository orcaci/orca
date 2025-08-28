# 📝 Orca Development Discussion & Iteration Tracking

## 🎯 Objective Recap (Without AI)
Build a comprehensive test automation platform that enables users to:
1. **Record** browser interactions and user workflows
2. **Organize** recorded actions into reusable groups
3. **Compose** test cases from action groups
4. **Orchestrate** test suites from multiple test cases
5. **Execute** tests with WebDriver integration
6. **Monitor** test results and maintain test health

---

## 📅 Conversation #1 - Database Model Analysis
**Date:** 2024-12-27  
**Topic:** Analyzing existing database models and their alignment with objectives  
**Goal:** Ensure current schema supports our test automation requirements

### 🗄️ Current Database Models Overview

Based on the codebase analysis, here's what we have:

#### **1. Application Model** (`app/app.rs`)
```rust
Model {
    id: Uuid,
    name: String,
    description: Option<String>,
}
```
**Purpose:** Multi-tenant support - each application being tested  
**Assessment:** ✅ Good foundation for multi-app testing

#### **2. Action Model** (`test/ui/action/action.rs`)
```rust
Model {
    id: Uuid,
    execution_order: i32,
    description: Option<String>,
    kind: ActionKind,           // Click, Enter, DoubleClick, Open, VerifyText, VerifyAttribute
    data_kind: Option<ActionDataKind>,    // Static, Runtime
    data_value: Option<String>,
    target_kind: Option<ActionTargetKind>, // CSS, XPath, ID
    target_value: Option<String>,
    action_group_id: Uuid,
}

enum ActionKind {
    Click,
    Enter,
    DoubleClick,
    Open,
    VerifyText,
    VerifyAttribute,
}
```
**Purpose:** Individual test steps/actions  
**Assessment:** ⚠️ Missing some important action types

#### **3. ActionGroup Model** (`test/ui/action/group.rs`)
```rust
Model {
    id: Uuid,
    name: String,
    description: Option<String>,
    type_field: ActionGroupKind,  // ActionGroup, Assertion
    app_id: Uuid,
}

enum ActionGroupKind {
    ActionGroup,
    Assertion,
}
```
**Purpose:** Reusable collections of actions  
**Assessment:** ✅ Good for modularity and reusability

#### **4. Case Model** (`test/ui/case/case.rs`)
```rust
Model {
    id: Uuid,
    name: String,
    description: Option<String>,
    app_id: Uuid,
    case_execution: Option<serde_json::Value>, // Runtime data
}
```
**Purpose:** Test scenarios composed of blocks  
**Assessment:** ✅ Simple and flexible

#### **5. CaseBlock Model** (`test/ui/case/case_block.rs`)
```rust
Model {
    id: Uuid,
    execution_order: i32,
    kind: BlockKind,        // Reference, SelfReference
    name: Option<String>,
    desc: Option<String>,
    type_field: BlockType,  // InMemory, DataTable, ActionGroup, Assertion, Loop, Condition, etc.
    reference: Option<Uuid>, // References ActionGroup or other blocks
    parent_id: Option<Uuid>, // For nested blocks (conditions, loops)
    case_id: Uuid,
    children: Option<Vec<Model>>, // For hierarchical structure
}

enum BlockType {
    InMemory,
    DataTable,
    ActionGroup,
    Assertion,
    Loop,
    Condition,
    YesCase,
    NoCase,
    Parallel,
    Block,
}
```
**Purpose:** Building blocks for test cases with flow control  
**Assessment:** ✅ Excellent - supports complex test flows

#### **6. Suite Model** (`test/ui/suit/suite.rs`)
```rust
Model {
    id: Uuid,
    name: String,
    description: Option<String>,
    app_id: Uuid,
}
```
**Purpose:** Collection of test cases  
**Assessment:** ✅ Good foundation

#### **7. SuiteBlock Model** (`test/ui/suit/suite_block.rs`)
```rust
Model {
    id: Uuid,
    execution_order: i32,
    case_id: Uuid,
    suite_id: Uuid,
}
```
**Purpose:** Links cases to suites with execution order  
**Assessment:** ✅ Simple and effective

#### **8. ExecutionRequest Model** (`test/ui/request.rs`)
```rust
Model {
    id: i32,
    description: Option<String>,
    is_dry_run: bool,
    ref_id: Uuid,
    ref_type: ExecutionType,    // TestCase, TestSuite
    kind: ExecutionKind,         // Scheduled, Trigger
    status: ExecutionStatus,     // Started, Running, Completed, Failed
    args: Option<serde_json::Value>,
    log_id: i32,
    // Timestamps and audit fields
}
```
**Purpose:** Track test execution requests  
**Assessment:** ✅ Good execution tracking

#### **9. ItemLog Model** (`test/ui/log/item_log.rs`)
```rust
Model {
    id: Uuid,
    ref_id: Uuid,
    ref_type: ItemLogType,       // TestCase, ActionGroup, etc.
    step_id: Uuid,
    has_screenshot: bool,
    has_recording: bool,
    execution_time: i32,
    status: ItemLogStatus,       // Running, Success, Failed
    log_id: Option<Uuid>,
    // Timestamps
}
```
**Purpose:** Detailed execution logs  
**Assessment:** ✅ Good for debugging and monitoring

### 🔍 Gap Analysis - What's Missing?

#### **Critical Missing Models:**

1. **Recording Model** ❌
```rust
// NEEDED: To store browser recording sessions
Recording {
    id: Uuid,
    app_id: Uuid,
    name: String,
    description: Option<String>,
    browser_type: String,        // Chrome, Firefox, etc.
    viewport_width: i32,
    viewport_height: i32,
    base_url: String,
    duration_ms: i32,
    created_by: String,
    created_at: DateTime,
}
```

2. **RecordedAction Model** ❌
```rust
// NEEDED: Raw captured browser actions
RecordedAction {
    id: Uuid,
    recording_id: Uuid,
    sequence_number: i32,
    timestamp_ms: i64,
    action_type: String,         // click, input, scroll, etc.
    target_element: String,      // Full selector path
    target_attributes: JsonValue, // Element attributes for smart selection
    value: Option<String>,       // Input value if applicable
    screenshot_before: Option<String>,
    screenshot_after: Option<String>,
    viewport_x: Option<i32>,
    viewport_y: Option<i32>,
}
```

3. **Element Model** ❌
```rust
// NEEDED: Smart element repository for reliable selection
Element {
    id: Uuid,
    app_id: Uuid,
    name: String,                // Human-readable name
    primary_selector: String,    // Main CSS/XPath selector
    fallback_selectors: Vec<String>, // Alternative selectors
    attributes: JsonValue,       // Key attributes for identification
    element_type: String,        // button, input, link, etc.
    last_verified: DateTime,
}
```

4. **TestData Model** ❌
```rust
// NEEDED: Parameterized test data management
TestData {
    id: Uuid,
    name: String,
    description: Option<String>,
    data_type: DataType,         // CSV, JSON, Database
    data_source: String,         // File path, query, etc.
    schema: JsonValue,
    app_id: Uuid,
}
```

5. **Environment Model** ❌
```rust
// NEEDED: Different test environments
Environment {
    id: Uuid,
    app_id: Uuid,
    name: String,                // Dev, Staging, Production
    base_url: String,
    variables: JsonValue,        // Environment-specific configs
    is_active: bool,
}
```

#### **Enhancements Needed for Existing Models:**

1. **Action Model Enhancements:**
   - Add more action types: `Hover`, `RightClick`, `DragDrop`, `ScrollTo`, `Wait`, `TakeScreenshot`
   - Add wait conditions: `WaitForElement`, `WaitForText`, `WaitForAttribute`
   - Add navigation actions: `Back`, `Forward`, `Refresh`
   - Add frame/window handling: `SwitchFrame`, `SwitchWindow`

2. **ActionGroup Model Enhancements:**
   - Add `is_shared` flag for cross-app reusability
   - Add `tags` for categorization
   - Add `version` for change tracking

3. **Case Model Enhancements:**
   - Add `priority` field (High, Medium, Low)
   - Add `tags` for categorization
   - Add `estimated_duration` for planning
   - Add `last_run_status` for quick status check

4. **Suite Model Enhancements:**
   - Add `schedule` field for automated execution
   - Add `notification_config` for result alerts
   - Add `parallel_execution` flag

### 📋 Database Schema Relationships

```
Application (1) ──────> (N) ActionGroup
     │                         │
     │                         ▼
     │                    (N) Action
     │
     ├────────> (N) Case
     │              │
     │              ▼
     │         (N) CaseBlock ──────> ActionGroup (Reference)
     │              │
     │              └──> CaseBlock (Self-reference for nesting)
     │
     ├────────> (N) Suite
     │              │
     │              ▼
     │         (N) SuiteBlock ──────> Case
     │
     ├────────> (N) Recording (NEW)
     │              │
     │              ▼
     │         (N) RecordedAction (NEW)
     │
     ├────────> (N) Element (NEW)
     │
     ├────────> (N) TestData (NEW)
     │
     └────────> (N) Environment (NEW)

ExecutionRequest ──────> ItemLog (Execution tracking)
```

### 🎯 Alignment with Objectives

| Objective | Current Support | Gap | Priority |
|-----------|----------------|-----|----------|
| **Record browser interactions** | ❌ No models | Need Recording & RecordedAction models | P0 - Critical |
| **Organize into reusable groups** | ✅ ActionGroup exists | Good foundation | - |
| **Compose test cases** | ✅ Case & CaseBlock | Well structured | - |
| **Orchestrate test suites** | ✅ Suite & SuiteBlock | Good foundation | - |
| **Execute with WebDriver** | ✅ Controllers exist | Need enhancement | P1 - High |
| **Monitor results** | ✅ ItemLog exists | Need dashboards | P2 - Medium |
| **Parameterized testing** | ❌ No support | Need TestData model | P1 - High |
| **Multi-environment** | ❌ No support | Need Environment model | P1 - High |
| **Element management** | ⚠️ Basic support | Need Element repository | P1 - High |

### 💡 Recommendations for Next Steps

1. **Immediate Priority (P0):**
   - Create Recording and RecordedAction models for capturing user interactions
   - Build recording API endpoints and storage mechanism
   - Create browser extension or recording interface

2. **High Priority (P1):**
   - Add Element model for reliable element selection
   - Add TestData model for parameterized testing
   - Add Environment model for multi-environment support
   - Enhance Action model with additional action types

3. **Medium Priority (P2):**
   - Build dashboards for monitoring and analytics
   - Add tagging and categorization features
   - Implement version control for test cases

### ❓ Discussion Points

1. **Recording Strategy:**
   - Should we use browser extension or embedded recorder?
   - How to handle dynamic elements and SPAs?
   - What level of detail to capture in recordings?

2. **Element Selection:**
   - How many fallback selectors should we maintain?
   - Should we implement visual element recognition?
   - How to handle element changes between recordings?

3. **Data Management:**
   - How to handle sensitive test data?
   - Should we support external data sources?
   - How to manage data dependencies between tests?

4. **Execution Strategy:**
   - Local vs. cloud execution?
   - Parallel execution limits?
   - Retry strategies for flaky tests?

### 📝 Action Items from This Discussion

1. [ ] Create migration for new Recording and RecordedAction tables
2. [ ] Create migration for Element, TestData, and Environment tables
3. [ ] Enhance Action model with additional action types
4. [ ] Design recording capture mechanism (browser extension vs embedded)
5. [ ] Create API endpoints for recording management
6. [ ] Build recording-to-action conversion logic

---

## 📅 Conversation #2 - [Next Topic]
**Date:** [TBD]  
**Topic:** [To be determined based on discussion]  
**Goal:** [Next iteration goal]

---

*This document will continue to grow with each development discussion and iteration.*