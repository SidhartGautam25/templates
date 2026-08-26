export type CreateLeadInput = {
  projectName: string;
  name: string;
  email: string;
  phone: string;
  message?: string | null;
};

export type LeadPayload = {
  projectName?: string;
  roomTypeName?: string;
  project?: string;
  name: string;
  email: string;
  phone: string;
  message?: string | null;
};

/**
 * Normalizes API/form payloads from hotel (roomTypeName) and real-estate (projectName) templates.
 */
export function normalizeLeadPayload(body: LeadPayload): CreateLeadInput {
  const projectName =
    body.projectName?.trim() ||
    body.roomTypeName?.trim() ||
    body.project?.trim() ||
    "";

  return {
    projectName,
    name: body.name,
    email: body.email,
    phone: body.phone,
    message: body.message,
  };
}
