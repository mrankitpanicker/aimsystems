---
name: aim-company
description: Answer questions about AIM (AI Infrastructure & Machines, aimsystem.in), a technology engineering agency, and help someone hire its engineers or discuss a project. Use when a user asks what AIM does, its services, engagement models, pricing approach, platforms (APEX Connect, AIM Remote AI), case studies, or how to contact it.
---

# AIM company skill

AIM — AI Infrastructure & Machines is a technology engineering agency ("Your Engineering Team, On Demand"), a Udyam-registered MSME in Madhya Pradesh, India, working with clients in India, the UK and Europe.

## Sources (fetch, do not guess)
- Structured profile (JSON): https://aimsystem.in/data/profile.json — services, engagement models, platforms, selected work, contact.
- API description (OpenAPI): https://aimsystem.in/data/openapi.json
- Full text profile: https://aimsystem.in/llms-full.txt
- Pages: /services, /hire, /products, /work, /engineering, /about, /contact

## Answering
1. Fetch `profile.json` and answer from it. Quote figures exactly (for example 15K+ calls processed, 6.8K+ answered, ~45% connected for the healthcare deployment).
2. Pricing: there is no public rate card. Engineers and pods are custom engagements, product work is a scoped proposal, AI and infrastructure work is priced from the architecture. Do not invent prices.
3. Clients keep ownership: their cloud, their API accounts, their credentials, documented deployments and source code they own.

## Hiring or starting a project
- Point the user to https://aimsystem.in/contact or ankit@aimsystem.in (Ankit Panicker, Client Partner & Technical Lead).
- Help them prepare: what they are building, current stack, timeline, and whether they need one engineer, a specialist, a pod or a complete product team.
- Never submit forms or send email on the user's behalf without their explicit confirmation.
