const { URL } = require("node:url");
const markupTags = require("@saltcorn/markup/tags");
const Workflow = require("@saltcorn/data/models/workflow");
const Form = require("@saltcorn/data/models/form");
const plantumlEncoder = require("plantuml-encoder");

function configuration_workflow() {
  return new Workflow({
    steps: [
      {
        name: "views",
        form: async (context) => {
          return new Form({
            fields: [
              {
                name: "base_url",
                label: "Base URL of PlantUML Server",
                type: "String",
                default: "https://www.plantuml.com/plantuml/",
                required: true,
              },
            ],
          });
        },
      },
    ],
  });
}

function plantuml_fieldview_run(v, cfg) {
  if (typeof v == "object") v = `@startjson\n${JSON.stringify(v)}\n@endjson`;
  const encoded = plantumlEncoder.encode(v);
  const url = new URL(
    `svg/${encoded}`,
    cfg.base_url || "https://www.plantuml.com/plantuml/",
  );
  return markupTags.img({ src: url.toString() });
}

module.exports = {
  sc_plugin_api_version: 1,
  plugin_name: "saltcorn-view-plantuml",
  configuration_workflow,
  fieldviews: (cfg) => ({
    plantuml: {
      type: "String",
      isEdit: false,
      run: (v, req, attrs) => plantuml_fieldview_run(v, cfg),
    },
    "plantuml-json": {
      type: "JSON",
      isEdit: false,
      run: (v, req, attrs) => plantuml_fieldview_run(v, cfg),
    },
  }),
};
