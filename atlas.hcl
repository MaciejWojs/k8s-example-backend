data "external_schema" "drizzle" {
    program = [
      "bunx",
      "--bun",
      "drizzle-kit",
      "export",
    ]
}

env "local" {
  dev = "docker://postgres/18/dev?search_path=public"
  schema {
    src = data.external_schema.drizzle.url
  }
  migration {
    dir = "file://atlas/migrations"
  }
  exclude = ["drizzle"]
}