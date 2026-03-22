resource "google_service_account" "runtime" {
  project      = var.project_id
  account_id   = var.service_account_id
  display_name = "Cloud Run runtime for ${var.service_name}"
}

resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.runtime.email}"
}

resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.runtime.email}"
}

resource "google_project_iam_member" "logs_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.runtime.email}"
}

resource "google_cloud_run_v2_service" "this" {
  project             = var.project_id
  name                = var.service_name
  location            = var.region
  ingress             = "INGRESS_TRAFFIC_ALL"
  deletion_protection = var.deletion_protection

  template {
    service_account = google_service_account.runtime.email

    containers {
      image = var.image_uri

      ports {
        container_port = 8080
      }

      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = "backend-database-url"
            version = "latest"
          }
        }
      }

      env {
        name = "DEBUG"
        value_source {
          secret_key_ref {
            secret  = "backend-debug"
            version = "latest"
          }
        }
      }

      env {
        name = "FIREBASE_PROJECT_ID"
        value_source {
          secret_key_ref {
            secret  = "backend-firebase-project-id"
            version = "latest"
          }
        }
      }

      env {
        name = "GCS_BUCKET_NAME"
        value_source {
          secret_key_ref {
            secret  = "backend-gcs-bucket-name"
            version = "latest"
          }
        }
      }

      env {
        name = "GCS_SIGNED_URL_EXPIRATION_SECONDS"
        value_source {
          secret_key_ref {
            secret  = "backend-gcs-signed-url-expiration-seconds"
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_PLACES_API_KEY"
        value_source {
          secret_key_ref {
            secret  = "backend-google-places-api-key"
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_PLACES_ENDPOINT"
        value_source {
          secret_key_ref {
            secret  = "backend-google-places-endpoint"
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_PLACES_LANGUAGE_CODE"
        value_source {
          secret_key_ref {
            secret  = "backend-google-places-language-code"
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_PLACES_REGION_CODE"
        value_source {
          secret_key_ref {
            secret  = "backend-google-places-region-code"
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_DIRECTIONS_API_KEY"
        value_source {
          secret_key_ref {
            secret  = "backend-google-directions-api-key"
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_ROUTES_API_KEY"
        value_source {
          secret_key_ref {
            secret  = "backend-google-routes-api-key"
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_ROUTES_ENDPOINT"
        value_source {
          secret_key_ref {
            secret  = "backend-google-routes-endpoint"
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_DIRECTIONS_ENDPOINT"
        value_source {
          secret_key_ref {
            secret  = "backend-google-directions-endpoint"
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_ROUTES_CONNECT_TIMEOUT_SECONDS"
        value_source {
          secret_key_ref {
            secret  = "backend-google-routes-connect-timeout-seconds"
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_ROUTES_READ_TIMEOUT_SECONDS"
        value_source {
          secret_key_ref {
            secret  = "backend-google-routes-read-timeout-seconds"
            version = "latest"
          }
        }
      }

      env {
        name = "GEMINI_API_KEY"
        value_source {
          secret_key_ref {
            secret  = "backend-gemini-api-key"
            version = "latest"
          }
        }
      }

      env {
        name = "GEMINI_API_BASE_URL"
        value_source {
          secret_key_ref {
            secret  = "backend-gemini-api-base-url"
            version = "latest"
          }
        }
      }

      env {
        name = "GEMINI_MODEL"
        value_source {
          secret_key_ref {
            secret  = "backend-gemini-model"
            version = "latest"
          }
        }
      }

      env {
        name = "GEMINI_CONNECT_TIMEOUT_SECONDS"
        value_source {
          secret_key_ref {
            secret  = "backend-gemini-connect-timeout-seconds"
            version = "latest"
          }
        }
      }

      env {
        name = "GEMINI_READ_TIMEOUT_SECONDS"
        value_source {
          secret_key_ref {
            secret  = "backend-gemini-read-timeout-seconds"
            version = "latest"
          }
        }
      }
    }
  }

  depends_on = [
    google_project_iam_member.secret_accessor,
    google_project_iam_member.cloudsql_client,
    google_project_iam_member.logs_writer,
  ]
}

resource "google_cloud_run_v2_service_iam_member" "invoker" {
  count = var.allow_unauthenticated ? 1 : 0

  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.this.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
