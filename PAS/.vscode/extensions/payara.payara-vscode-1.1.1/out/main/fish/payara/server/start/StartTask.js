'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartTask = void 0;
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const fse = require("fs-extra");
const path = require("path");
const cp = require("child_process");
const JavaUtils_1 = require("../tooling/utils/JavaUtils");
const StringUtils_1 = require("../tooling/utils/StringUtils");
const ServerUtils_1 = require("../tooling/utils/ServerUtils");
const JvmOption_1 = require("./JvmOption");
const JvmConfigReader_1 = require("./JvmConfigReader");
const JDKVersion_1 = require("./JDKVersion");
class StartTask {
    startServer(payaraServer, debug) {
        let jvmConfigReader = new JvmConfigReader_1.JvmConfigReader(payaraServer.getDomainXmlPath(), ServerUtils_1.ServerUtils.DAS_NAME);
        let javaHome = payaraServer.getJDKHome();
        if (!javaHome) {
            throw new Error("Java home path not found.");
        }
        let javaVersion = JDKVersion_1.JDKVersion.getJDKVersion(javaHome);
        if (!javaVersion) {
            throw new Error("Java version not found.");
        }
        let optList = new Array();
        for (const jvmOption of jvmConfigReader.getJvmOptions()) {
            if (JDKVersion_1.JDKVersion.isCorrectJDK(javaVersion, jvmOption.vendor, jvmOption.minVersion, jvmOption.maxVersion)) {
                optList.push(jvmOption.option);
            }
        }
        let propMap = jvmConfigReader.getPropMap();
        this.addJavaAgent(payaraServer, jvmConfigReader);
        // try to find bootstraping jar - usually glassfish.jar
        let bootstrapJar = path.join(payaraServer.getServerModules(), 'glassfish.jar');
        if (!fse.pathExistsSync(bootstrapJar)) {
            throw new Error("No bootstrap jar exist.");
        }
        let classPath = '';
        let javaOpts;
        let payaraArgs;
        // preparing variables to replace placeholders in options
        let varMap = this.varMap(payaraServer, javaHome);
        // Add debug parameters read from domain.xml.
        // It's important to add them before java options specified by user
        // in case user specified it by himslef.
        let debugOpt = propMap.get("debug-options");
        if (debug && debugOpt) {
            optList.push(debugOpt);
        }
        javaOpts = this.appendOptions(optList, varMap);
        javaOpts += this.appendVarMap(varMap);
        payaraArgs = this.appendPayaraArgs(this.getPayaraArgs(payaraServer));
        // starting the server using command
        let allArgs = this.buildJavaOptions(payaraServer, bootstrapJar, classPath, javaOpts, payaraArgs);
        let javaVmExe = JavaUtils_1.JavaUtils.javaVmExecutableFullPath(javaHome);
        // Java VM executable should exist.
        if (!fse.pathExistsSync(javaVmExe)) {
            throw new Error("Java VM " + javaVmExe + " executable for " + payaraServer.getName() + " was not found");
        }
        let args = JavaUtils_1.JavaUtils.parseParameters(allArgs);
        return cp.spawn(javaVmExe, args, { cwd: payaraServer.getPath() });
    }
    addJavaAgent(payaraServer, jvmConfigReader) {
        let optList = jvmConfigReader.getJvmOptions();
        let serverHome = payaraServer.getServerHome();
        const monitor = path.join(serverHome, 'lib', 'monitor');
        const btrace = path.join(monitor, "btrace-agent.jar");
        const flight = path.join(monitor, "flashlight-agent.jar");
        if (jvmConfigReader.isMonitoringEnabled()) {
            if (fse.pathExistsSync(btrace)) {
                optList.push(new JvmOption_1.JvmOption("-javaagent:" + StringUtils_1.StringUtils.quote(btrace) + "=unsafe=true,noServer=true"));
            }
            else if (fse.pathExistsSync(flight)) {
                optList.push(new JvmOption_1.JvmOption("-javaagent:" + StringUtils_1.StringUtils.quote(flight)));
            }
        }
    }
    /**
     * Build server variables map.
     *
     * @param server   Payara server entity
     * @param javaHome Java SE JDK home used to run Payara.
     */
    varMap(payaraServer, javaHome) {
        let varMap = new Map();
        varMap.set(ServerUtils_1.ServerUtils.PF_HOME_PROPERTY, payaraServer.getServerHome());
        varMap.set(ServerUtils_1.ServerUtils.PF_DOMAIN_ROOT_PROPERTY, payaraServer.getDomainPath());
        varMap.set(ServerUtils_1.ServerUtils.PF_JAVA_ROOT_PROPERTY, javaHome);
        varMap.set(JavaUtils_1.JavaUtils.PATH_SEPARATOR, path.delimiter);
        return varMap;
    }
    /**
     * Takes an list of java options and produces a valid string that can be put
     * on command line.
     *
     * There are two kinds of options that can be found in option list:
     * <code>key=value</code> and simple options not containing
     * <code>=</code>.
     * In the list there are both options from domain.xml and users options.
     * Thus some of them can be there more than once. For <code>key=value</code>
     * ones we can detect it and only the latest one in list will be appended to
     * command-line. For simple once maybe some duplicate detection will be
     * added in the future.
     *
     * @param argumentBuf Returned string.
     * @param optList     List of java options.
     * @param varMap      Map to be used for replacing place holders, Contains
     *                    <i>place holder</i> - <i>place holder</i> value pairs.
     */
    appendOptions(optList, varMap) {
        let argumentBuf = '';
        let moduleOptions = new Array();
        let keyValueArgs = new Map();
        let keyOrder = new Array();
        let name, value;
        // first process optList aquired from domain.xml 
        for (let opt of optList) {
            // do placeholder substitution
            opt = StringUtils_1.StringUtils.doSub(opt.trim(), varMap);
            let splitIndex = opt.indexOf('=');
            if (splitIndex !== -1 && !opt.startsWith("-agentpath:")) {
                // key=value type of option
                name = opt.substring(0, splitIndex);
                value = StringUtils_1.StringUtils.quote(opt.substring(splitIndex + 1));
            }
            else {
                name = opt;
                value = null;
            }
            // seperate modules options
            if (name.startsWith("--add-")) {
                moduleOptions.push(opt);
            }
            else {
                if (!keyValueArgs.has(name)) {
                    keyOrder.push(name);
                }
                keyValueArgs.set(name, value);
            }
        }
        // appending module options --add-modules --add-opens --add-exports
        argumentBuf = argumentBuf.concat(moduleOptions.join(" "));
        // appending key=value options to the command line argument
        // using the same order as they came in argument - important!
        for (let key of keyOrder) {
            argumentBuf = argumentBuf.concat(' ', key);
            if (keyValueArgs.get(key) !== null) {
                argumentBuf += '=' + keyValueArgs.get(key);
            }
        }
        return argumentBuf;
    }
    /**
     * Adds server variables from variables map into Java VM options
     * for server startup.
     *
     * @param javaOpts Java VM options {@link StringBuilder} instance.
     * @param varMap Server variables map.
     */
    appendVarMap(varMap) {
        let javaOpts = '';
        varMap.forEach((value, key) => {
            javaOpts += ' ' + JavaUtils_1.JavaUtils.systemProperty(key, value);
        });
        return javaOpts;
    }
    getPayaraArgs(payaraServer) {
        let payaraArgs = new Array();
        payaraArgs.push(ServerUtils_1.ServerUtils.cmdLineArgument(ServerUtils_1.ServerUtils.PF_DOMAIN_ARG, payaraServer.getDomainName()));
        payaraArgs.push(ServerUtils_1.ServerUtils.cmdLineArgument(ServerUtils_1.ServerUtils.PF_DOMAIN_DIR_ARG, StringUtils_1.StringUtils.quote(payaraServer.getDomainPath())));
        return payaraArgs;
    }
    /**
     * Append Payara startup arguments to given {@link StringBuilder}.
     * <p/>
     * @param payaraArgs     Target {@link StringBuilder} to append arguments.
     * @param payaraArgsList Arguments to be appended.
     */
    appendPayaraArgs(payaraArgsList) {
        let payaraArgs = '';
        for (let arg of payaraArgsList) {
            payaraArgs += ' ' + arg;
        }
        // remove the first space
        if (payaraArgs.length > 0) {
            payaraArgs = payaraArgs.substr(1);
        }
        return payaraArgs;
    }
    /**
     * Prepare Java VM options for Payara server execution.
     * <p/>
     * @param server  Payara server entity object.
     * @param command Payara Server Administration Command Entity.
     * @return Java VM options for Payara server execution
     *         as <cpde>String</code>.
     */
    buildJavaOptions(payaraServer, bootstrapJar, classPath, javaOpts, payaraArgs) {
        // Java VM options
        let result = '';
        let isClasspath = classPath !== null && classPath.length > 0;
        let isJavaOptions = javaOpts !== null && javaOpts.length > 0;
        let isPayaraArgs = payaraArgs !== null && payaraArgs.length > 0;
        result = result.concat(JavaUtils_1.JavaUtils.VM_CLASSPATH_OPTION, ' ');
        // Add classpath if exists.
        if (isClasspath) {
            result = result.concat(classPath, ' ');
        }
        else {
            result = result.concat(StringUtils_1.StringUtils.quote(bootstrapJar), ' ');
        }
        // Add Java VM options.
        if (isJavaOptions) {
            result = result.concat(javaOpts, ' ');
        }
        // Add startup main class or jar.
        result = result.concat(ServerUtils_1.ServerUtils.PF_MAIN_CLASS, ' ');
        // Add Payara specific options.
        if (isPayaraArgs) {
            result = result.concat(payaraArgs, ' ');
        }
        return result;
    }
}
exports.StartTask = StartTask;
//# sourceMappingURL=StartTask.js.map