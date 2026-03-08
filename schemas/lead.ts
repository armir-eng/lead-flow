import * as yup from "yup"


export const LeadSubmission = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    business_name: yup.string().required(),
    industry: yup.string().required(),
    message: yup.string().required()
})

export const GROQResponse = yup.object().shape({
    choices: yup.array().required() 
}).stripUnknown() // We only need the 'choices' field

export const AIResult = yup.object().shape({
    summary: yup.string().required(),
    category: yup.string().oneOf(["Automation", "Website", "AI Integration", "SEO", "Custom Software", "Other"]).required()
})

export const LeadRecord = LeadSubmission.concat(AIResult).shape({
    id: yup.string().uuid().required(),
    created_at: yup.string().datetime().required()
})

export const LeadsResponse = yup.array().of(LeadRecord)