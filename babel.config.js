module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          // Expo SDK 54 / Expo Go usa Hermes v0, que no soporta campos privados (#field).
          unstable_transformProfile: "hermes-v0",
        },
      ],
      "nativewind/babel",
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
