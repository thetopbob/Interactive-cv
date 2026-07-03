---
npc: "The Orchestrator"
title: "Autonomous Dev Agent Pipeline"
x: 560
y: 220
order: 2
---

A self-directed software development pipeline, built from Jira ticket to merge request.

- Orchestrated with LangGraph, tool calls bound via LangChain
- LLM inference through Amazon Bedrock, with Azure AI Foundry as a POC alternative
- Human-in-the-loop gates via Microsoft Teams Adaptive Cards and Logic Apps
- Temporal for durable workflow state, PostgreSQL for story state, Qdrant for RAG
- Covers spec generation, planning, coding, review, test execution, docs, and deployment
