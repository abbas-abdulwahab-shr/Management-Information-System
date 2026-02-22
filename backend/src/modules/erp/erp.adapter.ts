// Dummy ERP Adapter: transforms external ERP project data to local format

export interface ExternalERPProject {
  project_name: string
  project_desc?: string
  project_status: string
  project_officer: string
  start: string
  end?: string
}

export function transformERPProject(external: ExternalERPProject) {
  return {
    title: external.project_name,
    description: external.project_desc,
    status: external.project_status,
    officerId: external.project_officer,
    startDate: new Date(external.start),
    endDate: external.end ? new Date(external.end) : undefined,
  }
}
