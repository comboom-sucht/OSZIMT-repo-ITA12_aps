'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSupport = void 0;
/*
 * Copyright (c) 2020-2021 Payara Foundation and/or its affiliates and others.
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
const vscode = require("vscode");
const Maven_1 = require("./Maven");
const Gradle_1 = require("./Gradle");
class BuildSupport {
    static getBuild(payaraInstance, uri) {
        let workspace = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspace) {
            throw new Error("workspace not found for [" + uri.fsPath + "].");
        }
        if (Maven_1.Maven.detect(workspace)) {
            return new Maven_1.Maven(payaraInstance, workspace);
        }
        else if (Gradle_1.Gradle.detect(workspace)) {
            return new Gradle_1.Gradle(payaraInstance, workspace);
        }
        else {
            throw new Error("Project build not supported for [" + uri.fsPath + "].");
        }
    }
}
exports.BuildSupport = BuildSupport;
//# sourceMappingURL=BuildSupport.js.map