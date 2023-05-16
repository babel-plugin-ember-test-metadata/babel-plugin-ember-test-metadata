## v3.2.0 (2023-05-16)

#### :bug: Bug Fix
* `babel-plugin-ember-test-metadata`
  * [#241](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/241) [Bug] Fix test file paths for Ember addon project ([@zhanwang626](https://github.com/zhanwang626))

#### Committers: 1
- Zhan Wang ([@zhanwang626](https://github.com/zhanwang626))


## v3.1.1 (2023-02-21)

#### :rocket: Enhancement
* `babel-plugin-ember-test-metadata`
  * [#233](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/233) feat: add custom function as a babel option to normalize test file path ([@zhanwang626](https://github.com/zhanwang626))

#### :bug: Bug Fix
* `babel-plugin-ember-test-metadata`
  * [#235](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/235) Update `getCustomNormalizedFilePath` from a function to a resolved path ([@zhanwang626](https://github.com/zhanwang626))

#### Committers: 1
- Zhan Wang ([@zhanwang626](https://github.com/zhanwang626))


## v3.0.1 (2022-08-24)

#### :bug: Bug Fix
* `babel-plugin-ember-test-metadata`
  * [#185](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/185) Fixes incorrect file paths for duplicate segments in classic workspaces ([@drewlee](https://github.com/drewlee))

#### Committers: 1
- Andrew A Lee ([@drewlee](https://github.com/drewlee))


## v3.0.0 (2022-06-29)

#### :boom: Breaking Change
* `app-template`, `babel-plugin-ember-test-metadata`, `workspaces-template`
  * [#166](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/166) Upgrades Node to v14 ([@drewlee](https://github.com/drewlee))

#### :rocket: Enhancement
* `babel-plugin-ember-test-metadata`, `nonstandard-workspaces-template`, `test-scenarios`, `workspaces-template`
  * [#165](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/165) Fixes test filePath for workspaces projects ([@drewlee](https://github.com/drewlee))
  * [#160](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/160) Fixes test filePath for workspace projects ([@drewlee](https://github.com/drewlee))

#### :house: Internal
* `nonstandard-workspaces-template`, `test-scenarios`, `workspaces-template`
  * [#145](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/145) Create test workspace with ember app ([@ckundo](https://github.com/ckundo))
* `babel-plugin-ember-test-metadata`, `test-scenarios`
  * [#49](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/49) Renaming utils and removing deprecated portions of test setup ([@scalvert](https://github.com/scalvert))
* Other
  * [#45](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/45) Adds dependabot.yml for dependency updates ([@scalvert](https://github.com/scalvert))

#### Committers: 3
- Andrew A Lee ([@drewlee](https://github.com/drewlee))
- Cameron Cundiff ([@ckundo](https://github.com/ckundo))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v2.0.0 (2021-09-28)

#### :boom: Breaking Change
* `babel-plugin-ember-test-metadata`, `test-scenarios`
  * [#44](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/44) Adds config for package name and if running under embroider ([@scalvert](https://github.com/scalvert))

#### :rocket: Enhancement
* `babel-plugin-ember-test-metadata`, `test-scenarios`
  * [#42](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/42) Add util test cases for different path scenarios ([@ckundo](https://github.com/ckundo))

#### :bug: Bug Fix
* `babel-plugin-ember-test-metadata`, `test-scenarios`
  * [#39](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/39) Fix file paths for CLASSIC Ember builds ([@glnster](https://github.com/glnster))

#### :house: Internal
* `babel-plugin-ember-test-metadata`
  * [#43](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/43) Removes custom object path util in favor of object-path ([@scalvert](https://github.com/scalvert))
  * [#36](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/36) Removes unnecessary babel transpilation ([@scalvert](https://github.com/scalvert))
  * [#33](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/33) Converting to monorepo ([@scalvert](https://github.com/scalvert))
* `test-scenarios`
  * [#38](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/38) Add in repo test scenarios ([@scalvert](https://github.com/scalvert))
* `app-template`, `babel-plugin-ember-test-metadata`, `test-scenarios`
  * [#35](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/35) Adding test-scenarios package for acceptance-style tests ([@scalvert](https://github.com/scalvert))
* `app-template`
  * [#34](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/34) Adding app template to test plugin with ember applications ([@scalvert](https://github.com/scalvert))

#### Committers: 3
- Cameron Cundiff ([@ckundo](https://github.com/ckundo))
- Glenn Cueto ([@glnster](https://github.com/glnster))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v1.2.3 (2021-09-01)

#### :rocket: Enhancement
* [#29](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/29) Support embroider file path references ([@glnster](https://github.com/glnster))

#### Committers: 1
- Glenn Cueto ([@glnster](https://github.com/glnster))


## v1.2.2 (2021-08-09)

#### :house: Internal
* [#28](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/28) Cleanup of file casing, incorrect configs ([@scalvert](https://github.com/scalvert))

#### Committers: 1
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v1.2.1 (2021-08-05)

#### :memo: Documentation
* [#27](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/27) remove BABEL_TEST_METADATA early return check in index ([@glnster](https://github.com/glnster))

#### :house: Internal
* [#27](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/27) remove BABEL_TEST_METADATA early return check in index ([@glnster](https://github.com/glnster))

#### Committers: 1
- Glenn Cueto ([@glnster](https://github.com/glnster))


## v1.2.0 (2021-08-04)

#### :bug: Bug Fix
* [#26](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/26) Revisit state options and simplify features ([@ckundo](https://github.com/ckundo))

#### Committers: 1
- Cameron Cundiff ([@ckundo](https://github.com/ckundo))


## v1.1.0 (2021-08-04)

#### :bug: Bug Fix
* [#25](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/25) move env check to index ([@glnster](https://github.com/glnster))

#### Committers: 1
- Glenn Cueto ([@glnster](https://github.com/glnster))


## v1.0.0 (2021-08-03)

#### :rocket: Enhancement
* [#24](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/24) Add enabled opt ([@glnster](https://github.com/glnster))
#### :bug: Bug Fix
* [#23](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/23) Do not skip remaining transpilation ([@ckundo](https://github.com/ckundo))
* [#22](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/22) pass specific test context into getTestMetadata() instead of 'this' ([@glnster](https://github.com/glnster))
* [#21](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/21) fix index check ([@glnster](https://github.com/glnster))
* [#20](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/20) Perform nil check on nested function bodies ([@ckundo](https://github.com/ckundo))
* [#19](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/19) Fix utils import path ([@ckundo](https://github.com/ckundo))
* [#16](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/16) implement handling no func passed into module ([@glnster](https://github.com/glnster))
* [#17](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/17) handle beforeEach arg is not inline function ([@glnster](https://github.com/glnster))
#### :memo: Documentation
* [#12](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/12) Updates readme with usage information ([@scalvert](https://github.com/scalvert))
#### :house: Internal
* [#18](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/18) Point to dist/index.js for entrypoint ([@ckundo](https://github.com/ckundo))
* [#14](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/14) Part 1 Fix beforeEachModified conditional checking ([@glnster](https://github.com/glnster))
* [#11](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/pull/11) Removes package-lock.json ([@scalvert](https://github.com/scalvert))
#### Committers: 3
- Cameron Cundiff ([@ckundo](https://github.com/ckundo))
- Glenn Cueto ([@glnster](https://github.com/glnster))
- Steve Calvert ([@scalvert](https://github.com/scalvert))

# Changelog
