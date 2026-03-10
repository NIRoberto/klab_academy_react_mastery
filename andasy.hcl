# andasy.hcl app configuration file generated for reactmastery on Tuesday, 10-Mar-26 14:39:31 CAT
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "reactmastery"

app {

  env = {}

  port = 80

  primary_region = "fsn"

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "reactmastery"
  }

}
