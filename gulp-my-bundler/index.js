"use strict";

const Stream = require("stream");
const { PurgeCSS } = require("purgecss");

const ampStyles =
  "<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>";

function gulpRename(options) {
  options = options || {};

  var stream = new Stream.Transform({ objectMode: true });

  stream._transform = async function(file, unused, callback) {
    const purged = await new PurgeCSS().purge({
      content: ["src/" + file.relative],
      css: [options.cssSource]
    });

    if (file.isBuffer()) {
      file.contents = new Buffer(
        String(file.contents).replace(
          "<style amp-custom></style>",
          "<style amp-custom>" + purged[0].css + "</style>" + ampStyles
        )
      );
    }

    callback(null, file);
  };

  return stream;
}

module.exports = gulpRename;
