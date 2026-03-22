variable "project_id" {
  type = string
}

variable "name" {
  type = string
}

variable "description" {
  type    = string
  default = "Backend Cloud Build trigger"
}

variable "region" {
  type = string
}

variable "repository" {
  type = string
}

variable "branch_pattern" {
  type    = string
  default = "^main$"
}

variable "tag_pattern" {
  type    = string
  default = null
}

variable "config_file_path" {
  type    = string
  default = "backend/cloudbuild.yaml"
}

variable "included_files" {
  type    = list(string)
  default = ["backend/**"]
}

variable "substitutions" {
  type    = map(string)
  default = {}
}

variable "requires_approval" {
  type    = bool
  default = false
}

variable "service_account_email" {
  type    = string
  default = null
}
