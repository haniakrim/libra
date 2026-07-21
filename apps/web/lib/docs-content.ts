/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * docs-content.ts
 * Copyright (C) 2025 Nextify Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */

export type DocsLocale = 'en' | 'ar'

export interface DocsBlock {
  heading: string
  body: string[]
}

export interface DocsSection {
  slug: string
  title: string
  description: string
  blocks: DocsBlock[]
}

export interface DocsFaqEntry {
  question: string
  answer: string
}

export interface DocsContent {
  nav: {
    gettingStarted: string
    features: string
    guides: string
    faq: string
  }
  gettingStarted: DocsSection
  features: DocsSection
  guides: DocsSection
  faq: {
    title: string
    description: string
    entries: DocsFaqEntry[]
  }
}

export const DOCS_CONTENT: Record<DocsLocale, DocsContent> = {
  en: {
    nav: {
      gettingStarted: 'Getting Started',
      features: 'Features',
      guides: 'Guides',
      faq: 'FAQ',
    },
    gettingStarted: {
      slug: 'getting-started',
      title: 'Getting Started',
      description: 'Go from an idea to a running app in Nabd Agentic OS in a few minutes.',
      blocks: [
        {
          heading: '1. Create an account',
          body: [
            'Sign up with email or GitHub. New workspaces start on the Free plan, which includes a monthly AI generation quota and up to 3 projects.',
          ],
        },
        {
          heading: '2. Describe your app',
          body: [
            'On your dashboard, choose "Create Project" and describe what you want to build in plain language — a CRM, a landing page, an internal tool. The agent plans the structure, writes the code, and gives you a live preview as it works.',
          ],
        },
        {
          heading: '3. Iterate in the chat panel',
          body: [
            'Keep refining with follow-up messages: "add a dark mode toggle", "make the pricing table three columns". Each change is applied to the live preview and tracked in project history so you can roll back.',
          ],
        },
        {
          heading: '4. Connect GitHub (optional)',
          body: [
            'Link a repository from the Integrations page to sync generated code both ways — commits from the agent land in your repo, and you can keep editing with your own tools.',
          ],
        },
        {
          heading: '5. Deploy',
          body: [
            'Deploy straight from the project editor to get a live URL, or connect a custom domain from project settings once you are ready to go live.',
          ],
        },
      ],
    },
    features: {
      slug: 'features',
      title: 'Features',
      description: 'What Nabd Agentic OS gives you out of the box.',
      blocks: [
        {
          heading: 'AI-powered code generation',
          body: [
            'Multi-model support (Claude, Gemini, and more) with production-grade code generation, project-aware context, and best-practice conventions applied automatically.',
          ],
        },
        {
          heading: 'Open source, your code, your ownership',
          body: [
            'The platform itself is open source. Generated projects are plain React + TypeScript + Tailwind + shadcn/ui — no vendor lock-in, no black box, and you can export or self-host at any time.',
          ],
        },
        {
          heading: 'GitHub sync and custom domains',
          body: [
            'Two-way GitHub sync keeps a real repository in step with what the agent builds. Deploy to a shared subdomain instantly, or point your own domain at a project from its settings.',
          ],
        },
        {
          heading: 'Image uploads and visual editing',
          body: [
            'Attach screenshots or mockups to a chat message and the agent will match layout and style. A visual element picker lets you select any rendered element and ask for a targeted change.',
          ],
        },
        {
          heading: 'Integrations',
          body: [
            'Connect third-party tools — Slack, Notion, Linear, Discord, Google Drive, Gmail, Jira, Trello, and GitHub — from the Integrations page to wire your project into the tools your team already uses.',
          ],
        },
        {
          heading: 'Teams and organizations',
          body: [
            'Invite teammates into an organization workspace, share projects, and manage seats and billing centrally under Teams and Billing.',
          ],
        },
      ],
    },
    guides: {
      slug: 'guides',
      title: 'Guides',
      description: 'Practical walkthroughs for common tasks.',
      blocks: [
        {
          heading: 'Writing effective prompts',
          body: [
            'Be specific about the outcome, not the implementation: "a Kanban board with drag-and-drop columns for To Do / In Progress / Done" works better than vague requests. Mention constraints (data model, page layout, key user flows) up front — the agent will still ask if something is ambiguous.',
          ],
        },
        {
          heading: 'Connecting a GitHub repository',
          body: [
            'From Dashboard → Integrations, authorize the GitHub App, then choose or create a repository from your project settings. Every agent change creates a commit; you can also push your own commits and the agent will pick them up on the next message.',
          ],
        },
        {
          heading: 'Adding a custom domain',
          body: [
            'Open your project, go to Settings → Domains, add your domain, and create the DNS records shown (typically a CNAME). SSL is provisioned automatically once DNS resolves.',
          ],
        },
        {
          heading: 'Managing quota and plans',
          body: [
            'Your AI generation quota, seats, and project limit are shown on Billing. Free plans reset monthly; paid plans (Pro, Max) raise every limit and unlock additional models. Quota usage per project is visible from the project dashboard.',
          ],
        },
        {
          heading: 'Rolling back a change',
          body: [
            'Every AI-applied change is recorded in project history. Open the history panel in the project editor to preview and restore any previous version.',
          ],
        },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      description: 'Short answers to the questions we hear most.',
      entries: [
        {
          question: 'Is Nabd Agentic OS open source?',
          answer:
            "Yes. The platform is released under the AGPL-3.0 license. You can self-host it, and if you modify and run it as a network service, the license requires making your source changes available to your users — see the GitHub link in the sidebar for this instance's source.",
        },
        {
          question: 'What happens to my code?',
          answer:
            'Generated projects are ordinary React/TypeScript codebases. You own them outright — sync to your own GitHub repository, export at any time, and run them anywhere.',
        },
        {
          question: 'What is the pricing model?',
          answer:
            'Free forever for a starter quota of AI generations, seats, and projects. Paid plans (Pro, Max) raise every limit and add more capable models. See Billing in your dashboard for current numbers.',
        },
        {
          question: 'Do I need programming experience?',
          answer:
            'No. Describe what you want in plain language. Programming experience helps if you want to fine-tune generated code directly, but it is not required to build and ship a working app.',
        },
        {
          question: 'Who owns the code the agent writes?',
          answer:
            'You do, fully and unconditionally — it is your project from the first line generated.',
        },
        {
          question: "What's the difference from other AI builders?",
          answer:
            'Nabd Agentic OS generates standard, inspectable code (not a proprietary format), syncs both ways with a real GitHub repository, and the platform itself is open source rather than a closed hosted product.',
        },
      ],
    },
  },
  ar: {
    nav: {
      gettingStarted: 'البدء',
      features: 'المزايا',
      guides: 'الأدلة',
      faq: 'الأسئلة الشائعة',
    },
    gettingStarted: {
      slug: 'getting-started',
      title: 'البدء',
      description: 'من الفكرة إلى تطبيق يعمل في نظام نبض الوكيل الذكي خلال دقائق قليلة.',
      blocks: [
        {
          heading: '١. أنشئ حسابًا',
          body: [
            'سجّل باستخدام بريدك الإلكتروني أو حساب GitHub. تبدأ مساحات العمل الجديدة بالخطة المجانية، التي تتضمن حصة شهرية من توليد الذكاء الاصطناعي وحتى ٣ مشاريع.',
          ],
        },
        {
          heading: '٢. صف تطبيقك',
          body: [
            'من لوحة التحكم، اختر "إنشاء مشروع" وصف ما تريد بناءه بلغة بسيطة — نظام إدارة علاقات العملاء، صفحة هبوط، أداة داخلية. يقوم الوكيل بتخطيط البنية وكتابة الكود وعرض معاينة حية أثناء العمل.',
          ],
        },
        {
          heading: '٣. طوّر عبر لوحة المحادثة',
          body: [
            'واصل التحسين برسائل متابعة مثل: "أضف زر تبديل للوضع الداكن"، "اجعل جدول الأسعار ثلاثة أعمدة". يُطبَّق كل تغيير على المعاينة الحية ويُسجَّل في سجل المشروع بحيث يمكنك التراجع عنه.',
          ],
        },
        {
          heading: '٤. اربط GitHub (اختياري)',
          body: [
            'اربط مستودعًا من صفحة التكاملات لمزامنة الكود المولَّد في الاتجاهين — تصل التزامات الوكيل إلى مستودعك، ويمكنك مواصلة التعديل بأدواتك الخاصة.',
          ],
        },
        {
          heading: '٥. انشر',
          body: [
            'انشر مباشرة من محرر المشروع للحصول على رابط مباشر، أو اربط نطاقًا مخصصًا من إعدادات المشروع عند الاستعداد للانطلاق.',
          ],
        },
      ],
    },
    features: {
      slug: 'features',
      title: 'المزايا',
      description: 'ما يقدمه نظام نبض الوكيل الذكي جاهزًا من الصندوق.',
      blocks: [
        {
          heading: 'توليد كود مدعوم بالذكاء الاصطناعي',
          body: [
            'دعم متعدد النماذج (Claude وGemini وغيرها) مع توليد كود بجودة إنتاجية، وسياق واعٍ بالمشروع، وتطبيق أفضل الممارسات تلقائيًا.',
          ],
        },
        {
          heading: 'مفتوح المصدر، كودك ملكك',
          body: [
            'المنصة نفسها مفتوحة المصدر. المشاريع المولَّدة هي React وTypeScript وTailwind وshadcn/ui عادية — بلا ارتباط بمزوّد واحد، وبلا صندوق أسود، ويمكنك التصدير أو الاستضافة الذاتية في أي وقت.',
          ],
        },
        {
          heading: 'مزامنة GitHub ونطاقات مخصصة',
          body: [
            'تحافظ المزامنة الثنائية مع GitHub على مستودع حقيقي متوافق مع ما يبنيه الوكيل. انشر على نطاق فرعي مشترك فورًا، أو وجّه نطاقك الخاص إلى مشروع من إعداداته.',
          ],
        },
        {
          heading: 'رفع الصور والتحرير المرئي',
          body: [
            'أرفق لقطات شاشة أو تصاميم أولية برسالة محادثة وسيطابق الوكيل التخطيط والأسلوب. يتيح لك منتقي العناصر المرئي اختيار أي عنصر معروض وطلب تغيير محدد عليه.',
          ],
        },
        {
          heading: 'التكاملات',
          body: [
            'اربط أدوات خارجية — Slack وNotion وLinear وDiscord وGoogle Drive وGmail وJira وTrello وGitHub — من صفحة التكاملات لدمج مشروعك بالأدوات التي يستخدمها فريقك بالفعل.',
          ],
        },
        {
          heading: 'الفرق والمؤسسات',
          body: [
            'ادعُ زملاءك إلى مساحة عمل مؤسسة، وشارك المشاريع، وأدر المقاعد والفوترة مركزيًا من صفحتَي الفرق والفوترة.',
          ],
        },
      ],
    },
    guides: {
      slug: 'guides',
      title: 'الأدلة',
      description: 'شروحات عملية للمهام الشائعة.',
      blocks: [
        {
          heading: 'كتابة طلبات فعّالة',
          body: [
            'كن محددًا بشأن النتيجة لا طريقة التنفيذ: طلب مثل "لوحة كانبان بأعمدة سحب وإفلات: قيد الانتظار / قيد التنفيذ / مكتمل" أفضل من طلب غامض. اذكر القيود (نموذج البيانات، تخطيط الصفحة، مسارات المستخدم الأساسية) مسبقًا — سيسأل الوكيل إن كان هناك غموض.',
          ],
        },
        {
          heading: 'ربط مستودع GitHub',
          body: [
            'من لوحة التحكم ← التكاملات، فوّض تطبيق GitHub، ثم اختر أو أنشئ مستودعًا من إعدادات مشروعك. كل تغيير من الوكيل ينشئ التزامًا؛ ويمكنك أيضًا دفع التزاماتك الخاصة وسيلتقطها الوكيل في الرسالة التالية.',
          ],
        },
        {
          heading: 'إضافة نطاق مخصص',
          body: [
            'افتح مشروعك، اذهب إلى الإعدادات ← النطاقات، أضف نطاقك، وأنشئ سجلات DNS الموضحة (عادةً سجل CNAME). تُوفَّر شهادة SSL تلقائيًا فور تحلل DNS.',
          ],
        },
        {
          heading: 'إدارة الحصة والخطط',
          body: [
            'تظهر حصة توليد الذكاء الاصطناعي والمقاعد وحد المشاريع في صفحة الفوترة. تُجدَّد الخطة المجانية شهريًا؛ وترفع الخطط المدفوعة (Pro وMax) كل الحدود وتفتح نماذج إضافية. استخدام الحصة لكل مشروع مرئي من لوحة المشروع.',
          ],
        },
        {
          heading: 'التراجع عن تغيير',
          body: [
            'يُسجَّل كل تغيير طبّقه الذكاء الاصطناعي في سجل المشروع. افتح لوحة السجل في محرر المشروع لمعاينة أي نسخة سابقة واستعادتها.',
          ],
        },
      ],
    },
    faq: {
      title: 'الأسئلة الشائعة',
      description: 'إجابات مختصرة لأكثر الأسئلة التي نتلقاها.',
      entries: [
        {
          question: 'هل نظام نبض الوكيل الذكي مفتوح المصدر؟',
          answer:
            'نعم. تُصدَر المنصة برخصة AGPL-3.0. يمكنك استضافتها ذاتيًا، وإذا عدّلتها وشغّلتها كخدمة شبكية، تُلزمك الرخصة بإتاحة تعديلات الكود لمستخدميك — راجع رابط GitHub في الشريط الجانبي لكود هذه النسخة تحديدًا.',
        },
        {
          question: 'ماذا يحدث لكودي؟',
          answer:
            'المشاريع المولَّدة هي مشاريع React/TypeScript عادية. تملكها بالكامل — زامنها مع مستودع GitHub الخاص بك، وصدّرها في أي وقت، وشغّلها في أي مكان.',
        },
        {
          question: 'ما هو نموذج التسعير؟',
          answer:
            'مجاني إلى الأبد لحصة أساسية من توليدات الذكاء الاصطناعي والمقاعد والمشاريع. الخطط المدفوعة (Pro وMax) ترفع كل الحدود وتضيف نماذج أقوى. راجع صفحة الفوترة في لوحتك للأرقام الحالية.',
        },
        {
          question: 'هل أحتاج خبرة برمجية؟',
          answer:
            'لا. صف ما تريده بلغة بسيطة. الخبرة البرمجية مفيدة إن أردت ضبط الكود المولَّد مباشرة، لكنها ليست شرطًا لبناء تطبيق يعمل ونشره.',
        },
        {
          question: 'من يملك الكود الذي يكتبه الوكيل؟',
          answer: 'أنت، بالكامل ودون قيد — إنه مشروعك منذ أول سطر يُولَّد.',
        },
        {
          question: 'ما الفرق عن أدوات بناء الذكاء الاصطناعي الأخرى؟',
          answer:
            'ينتج نظام نبض الوكيل الذكي كودًا قياسيًا قابلًا للفحص (وليس صيغة مملوكة)، ويُزامن ثنائيًا مع مستودع GitHub حقيقي، والمنصة نفسها مفتوحة المصدر لا منتجًا مستضافًا مغلقًا.',
        },
      ],
    },
  },
}
