locals {
  service_account_full = (
    var.service_account_email == null || var.service_account_email == ""
    ? null
    : (
      startswith(var.service_account_email, "projects/")
      ? var.service_account_email
      : "projects/${var.project_id}/serviceAccounts/${var.service_account_email}"
    )
  )
}

resource "google_cloudbuild_trigger" "this" {
  name        = var.name
  description = var.description
  project     = var.project_id
  location    = var.region

  repository_event_config {
    repository = var.repository

    dynamic "push" {
      for_each = var.branch_pattern != null ? [var.branch_pattern] : []
      content {
        branch = push.value
      }
    }

    dynamic "push" {
      for_each = var.tag_pattern != null ? [var.tag_pattern] : []
      content {
        tag = push.value
      }
    }
  }

  filename       = var.config_file_path
  substitutions  = var.substitutions
  included_files = var.included_files

  approval_config {
    approval_required = var.requires_approval
  }

  service_account = local.service_account_full
}
