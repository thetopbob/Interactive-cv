---
npc: "The Orchestrator"
title: "Autonomous Dev Agent Pipeline"
x: 560
y: 220
order: 2
---

I built a proof of concept to test theories about the potential benefits and costs of a self-directed software development pipeline, starting from Jira ticket through to merge request.

- Orchestrated with LangGraph, tool calls bound via LangChain
- LLM inference using Azure AI Foundry with the ability to leverage different models in each phase
- Human-in-the-loop gates with inputs and overrides through a custom React interface
- Temporal for durable workflow state, PostgreSQL for story state, Qdrant for RAG
- Covers spec generation, planning, coding, review, test execution, docs, and deployment to a Salesforce org ready for human review
- Full cost overview per-requirement and per-phase by tracking token usage and running a pricing engine to help answer the question of 'how much does this cost to deliver?'

From this project I took away several learnings, not least thinking about when not to use non-deterministic and potentially expensive LLM calls and instead sticking to deterministic evaluations instead.
