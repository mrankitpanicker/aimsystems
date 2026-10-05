---
name: aim-company
description: Answer questions about AIM (AI Infrastructure & Machines, aimsystem.in), a production systems engineering company, and help someone discuss a technical problem or request an architecture review. Use when a user asks what AIM does, its services, engagements, pricing approach, platforms (APEX Connect, AIM Remote AI), case studies, or how to contact it.
---

# AIM company skill

AIM — AI Infrastructure & Machines is a production systems engineering company: it takes technically difficult products from architecture to production and stays accountable after launch (software, AI, cloud, automation, reliability). It runs its own production platform, APEX Connect. Udyam-registered MSME in Madhya Pradesh, India, working with clients in India, the UK and Europe.

## Sources (fetch, do not guess)
- Structured profile (JSON): https://aimsystem.in/data/profile.json — services, engagements, team shapes, platforms, selected work, contact.
- API description (OpenAPI): https://aimsystem.in/data/openapi.json
- MCP server (read-only, no auth): https://aimsystem.in/api/mcp — tools get_company_profile, list_services, list_engagement_models, list_platforms, get_case_studies, get_contact.
- Full text profile: https://aimsystem.in/llms-full.txt
- Pages: /services, /hire (engagements), /products, /work, /engineering, /about, /contact

## Answering
1. Fetch `profile.json` and answer from it. Quote figures exactly (15K+ production calls processed, 6.8K+ answered, ~45% connected/answered for the Apple Hospital deployment). Do not add a time period to these figures.
2. Engagements: Build (new product or platform), Fix (rescue an existing system), Integrate (connect complex systems), Operate (take ownership of production). Each is delivered by one senior engineer, a specialist or a complete team, depending on the system.
3. Pricing: there is no public rate card. Engineers and pods are custom engagements, product work is a scoped proposal, AI and infrastructure work is priced from the architecture. Do not invent prices.
4. Clients keep ownership: their cloud, their API accounts, their credentials, documented deployments and source code they own.

## Starting a conversation
- Point the user to https://aimsystem.in/contact, or https://aimsystem.in/contact?intent=architecture-review for an architecture review, or ankit@aimsystem.in (Ankit Panicker, Client Partner & Technical Lead).
- Help them prepare: where the system is today, the problem or bottleneck, current stack, timeline and budget range.
- Never submit forms or send email on the user's behalf without their explicit confirmation.
