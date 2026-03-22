terraform {
  backend "gcs" {}
}

module "backend_infra" {
  source = "../../"

  environment                                       = "prod"
  project_id                                        = var.project_id
  region                                            = var.region
  artifact_registry_repository                      = var.artifact_registry_repository
  cloud_run_service_name                            = var.cloud_run_service_name
  cloud_run_service_account_id                      = var.cloud_run_service_account_id
  cloud_run_allow_unauthenticated                   = var.cloud_run_allow_unauthenticated
  cloud_run_deletion_protection                     = var.cloud_run_deletion_protection
  cloudbuild_trigger_name                           = var.cloudbuild_trigger_name
  cloudbuild_location                               = var.cloudbuild_location
  cloudbuild_filename                               = var.cloudbuild_filename
  cloudbuild_included_files                         = var.cloudbuild_included_files
  cloudbuild_image                                  = var.cloudbuild_image
  cloudbuild_repository                             = var.cloudbuild_repository
  cloudbuild_branch_regex                           = var.cloudbuild_branch_regex
  cloudbuild_tag_pattern                            = var.cloudbuild_tag_pattern
  cloudbuild_requires_approval                      = var.cloudbuild_requires_approval
  cloudbuild_service_account_id                     = var.cloudbuild_service_account_id
  github_owner                                      = var.github_owner
  github_repo                                       = var.github_repo
  github_branch_regex                               = var.github_branch_regex
  cloud_sql_instance_name                           = var.cloud_sql_instance_name
  cloud_sql_database_version                        = var.cloud_sql_database_version
  cloud_sql_tier                                    = var.cloud_sql_tier
  cloud_sql_disk_size_gb                            = var.cloud_sql_disk_size_gb
  cloud_sql_availability_type                       = var.cloud_sql_availability_type
  cloud_sql_authorized_cidr                         = var.cloud_sql_authorized_cidr
  cloud_sql_db_name                                 = var.cloud_sql_db_name
  cloud_sql_db_user                                 = var.cloud_sql_db_user
  cloud_sql_db_user_password                        = var.cloud_sql_db_user_password
  cloud_sql_deletion_protection                     = var.cloud_sql_deletion_protection
  secret_name_database_url                          = var.secret_name_database_url
  secret_name_debug                                 = var.secret_name_debug
  secret_name_firebase_project_id                   = var.secret_name_firebase_project_id
  secret_name_gcs_bucket_name                       = var.secret_name_gcs_bucket_name
  secret_name_gcs_signed_url_expiration_seconds     = var.secret_name_gcs_signed_url_expiration_seconds
  secret_name_google_places_api_key                 = var.secret_name_google_places_api_key
  secret_name_google_places_endpoint                = var.secret_name_google_places_endpoint
  secret_name_google_places_language_code           = var.secret_name_google_places_language_code
  secret_name_google_places_region_code             = var.secret_name_google_places_region_code
  secret_name_google_directions_api_key             = var.secret_name_google_directions_api_key
  secret_name_google_routes_api_key                 = var.secret_name_google_routes_api_key
  secret_name_google_routes_endpoint                = var.secret_name_google_routes_endpoint
  secret_name_google_directions_endpoint            = var.secret_name_google_directions_endpoint
  secret_name_google_routes_connect_timeout_seconds = var.secret_name_google_routes_connect_timeout_seconds
  secret_name_google_routes_read_timeout_seconds    = var.secret_name_google_routes_read_timeout_seconds
  secret_name_gemini_api_key                        = var.secret_name_gemini_api_key
  secret_name_gemini_api_base_url                   = var.secret_name_gemini_api_base_url
  secret_name_gemini_model                          = var.secret_name_gemini_model
  secret_name_gemini_connect_timeout_seconds        = var.secret_name_gemini_connect_timeout_seconds
  secret_name_gemini_read_timeout_seconds           = var.secret_name_gemini_read_timeout_seconds
  secret_debug                                      = var.secret_debug
  secret_firebase_project_id                        = var.secret_firebase_project_id
  secret_gcs_bucket_name                            = var.secret_gcs_bucket_name
  secret_gcs_signed_url_expiration_seconds          = var.secret_gcs_signed_url_expiration_seconds
  secret_google_places_api_key                      = var.secret_google_places_api_key
  secret_google_places_endpoint                     = var.secret_google_places_endpoint
  secret_google_places_language_code                = var.secret_google_places_language_code
  secret_google_places_region_code                  = var.secret_google_places_region_code
  secret_google_directions_api_key                  = var.secret_google_directions_api_key
  secret_google_routes_api_key                      = var.secret_google_routes_api_key
  secret_google_routes_endpoint                     = var.secret_google_routes_endpoint
  secret_google_directions_endpoint                 = var.secret_google_directions_endpoint
  secret_google_routes_connect_timeout_seconds      = var.secret_google_routes_connect_timeout_seconds
  secret_google_routes_read_timeout_seconds         = var.secret_google_routes_read_timeout_seconds
  secret_gemini_api_key                             = var.secret_gemini_api_key
  secret_gemini_api_base_url                        = var.secret_gemini_api_base_url
  secret_gemini_model                               = var.secret_gemini_model
  secret_gemini_connect_timeout_seconds             = var.secret_gemini_connect_timeout_seconds
  secret_gemini_read_timeout_seconds                = var.secret_gemini_read_timeout_seconds
}

output "environment" {
  value = module.backend_infra.environment
}

output "project_id" {
  value = module.backend_infra.project_id
}

output "region" {
  value = module.backend_infra.region
}

output "cloud_run_service_url" {
  value = module.backend_infra.cloud_run_service_url
}

output "artifact_registry_repository_url" {
  value = module.backend_infra.artifact_registry_repository_url
}

output "cloud_sql_connection_name" {
  value = module.backend_infra.cloud_sql_connection_name
}

output "cloud_sql_public_ip" {
  value = module.backend_infra.cloud_sql_public_ip
}

output "cloud_build_trigger_id" {
  value = module.backend_infra.cloud_build_trigger_id
}
