const presets = [
    [
      "@babel/env",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
        useBuiltIns: "usage",
      },
    ],
  ];

  module.exports = { presets };
/*
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-stage-2"
    ],
    "plugins": [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-transform-regenerator"
    ]
}
*/