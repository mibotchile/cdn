import { compile, helpers, templates } from "squirrelly";

export class SquerrillyHelpers {
  constructor() {}

  extendsHelper() {
    helpers.define("extends", function (content, blocks, config) {
      const data = content.params[1] || {};
      data.content = content.exec();

      for (let i = 0; i < blocks.length; i++) {
        const currentBlock = blocks[i];
        data[currentBlock.name] = currentBlock.exec();
      }
      const template = config.storage.templates.get(content.params[0]);
      if (!template) {
        throw new Error('Could not fetch template "' + content.params[0] + '"');
      }
      return template(data, config);
    });
  }

  init() {
    this.extendsHelper();
  }
}
