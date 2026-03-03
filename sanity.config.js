import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './sanity/schema'
import { apiVersion, dataset, projectId } from './sanity/env'
import { TranslateAction } from './sanity/actions/TranslateAction'


export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    schema,
    plugins: [
        structureTool(),
        visionTool({ defaultApiVersion: apiVersion }),
    ],
    document: {
        actions: (prev, context) => {
            if (context.schemaType === 'article') {
                return [...prev, TranslateAction]
            }
            return prev
        }
    }
})

