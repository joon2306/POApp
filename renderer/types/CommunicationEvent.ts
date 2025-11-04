import { get } from "http";

const CommunicationEvents = Object.freeze({
    getKanbanCards: "kanban-cards",
    saveKanbanCard: "save-kanban-card",
    deleteKanbanCard: "delete-kanban-card",
    modifyKanbanCard: "modify-kanban-card",
    generateFeature: "generate-feature",
    refineFeature: "refine-feature",
    summaryFeature: "summary-feature",
    exportFeature: "export-feature",
    translateEmail: "translate-email",
    generateJira: "generate-jira",
    improveEnglish: "improve-english",
    getProductivity: "getProductivity",
    copy: "copy",
    generateToken: "generateToken",
    getVaultItems: "getVaultItems",
    saveVaultItem: "saveVaultItem",
    deleteVaultItem: "deleteVaultItem",
    modifyVaultItem: "modifyVaultItem"
});

export default CommunicationEvents;