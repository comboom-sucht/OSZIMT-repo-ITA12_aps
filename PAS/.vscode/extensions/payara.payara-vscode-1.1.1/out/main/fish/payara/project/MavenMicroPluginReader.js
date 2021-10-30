'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.MavenMicroPluginReader = void 0;
/*
 * Copyright (c) 2020 Payara Foundation and/or its affiliates and others.
 * All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0, which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the
 * Eclipse Public License v. 2.0 are satisfied: GNU General Public License,
 * version 2 with the GNU Classpath Exception, which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 */
const fse = require("fs-extra");
const path = require("path");
const xml2js = require("xml2js");
const PayaraMicroMavenPlugin_1 = require("../micro/PayaraMicroMavenPlugin");
class MavenMicroPluginReader {
    constructor(workspaceFolder) {
        this.workspaceFolder = workspaceFolder;
        this.pluginFound = false;
        this.parsePom();
    }
    parsePom() {
        let reader = this;
        let pomPath = path.join(this.workspaceFolder.uri.fsPath, 'pom.xml');
        if (fse.existsSync(pomPath)) {
            let data = fse.readFileSync(pomPath);
            let parser = new xml2js.Parser({
                trim: true,
                explicitArray: true
            });
            parser.parseString(data, function (err, result) {
                if (err) {
                    throw new Error(`Unable to parse file ${pomPath} : ${err.message}`);
                }
                if (result.project) {
                    let plugin = reader.parseBuild(result.project.build);
                    reader.pluginFound = plugin !== undefined;
                    if (!reader.pluginFound && result.project.profiles) {
                        for (let profile of result.project.profiles[0].profile) {
                            if (reader.pluginFound) {
                                break;
                            }
                            let plugin = reader.parseBuild(profile.build);
                            reader.pluginFound = plugin !== undefined;
                        }
                    }
                    if (plugin
                        && Array.isArray(plugin.configuration)
                        && plugin.configuration[0]) {
                        let config = plugin.configuration[0];
                        reader.deployWar = config.deployWar ? JSON.parse(config.deployWar[0]) : undefined;
                        reader.exploded = config.exploded ? JSON.parse(config.exploded[0]) : undefined;
                        reader.useUberJar = config.useUberJar ? JSON.parse(config.useUberJar[0]) : undefined;
                    }
                }
            });
        }
    }
    parseBuild(build) {
        if (build
            && build[0]
            && build[0].plugins[0]
            && build[0].plugins[0].plugin) {
            for (let plugin of build[0].plugins[0].plugin) {
                let groupId = plugin.groupId[0];
                let artifactId = plugin.artifactId[0];
                if (groupId === PayaraMicroMavenPlugin_1.PayaraMicroMavenPlugin.GROUP_ID
                    && artifactId === PayaraMicroMavenPlugin_1.PayaraMicroMavenPlugin.ARTIFACT_ID) {
                    return plugin;
                }
            }
        }
        return undefined;
    }
    isPluginFound() {
        return this.pluginFound;
    }
    isDeployWarEnabled() {
        return this.deployWar;
    }
    isUberJarEnabled() {
        return this.useUberJar;
    }
    isExplodedEnabled() {
        return this.exploded;
    }
}
exports.MavenMicroPluginReader = MavenMicroPluginReader;
//# sourceMappingURL=MavenMicroPluginReader.js.map