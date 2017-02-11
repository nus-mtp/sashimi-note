module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "plugins": [
        "mocha"
    ],
    "rules": {
        "mocha/no-exclusive-tests": "error",
        "import/no-extraneous-dependencies": [
            "error", {
                "devDependencies": true, 
                "optionalDependencies": false, 
                "peerDependencies": true
            }
        ]
    }
};