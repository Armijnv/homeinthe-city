import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('provider').title('Providers / Person Profiles'),
      S.documentTypeListItem('host').title('Legacy Hosts'),
      S.documentTypeListItem('city').title('Cities'),
      S.documentTypeListItem('servicePage').title('Service Pages'),
    ])
