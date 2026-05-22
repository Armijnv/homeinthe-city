'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './sanity/env'
import {
  ApproveProviderSubmissionAction,
  RejectProviderSubmissionAction,
} from './sanity/actions/providerSubmissionActions'
import {schemaTypes} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (previousActions, context) =>
      context.schemaType === 'providerSubmission'
        ? [
            ...previousActions,
            ApproveProviderSubmissionAction,
            RejectProviderSubmissionAction,
          ]
        : previousActions,
  },

  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
