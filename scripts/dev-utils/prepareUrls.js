'use strict';

const url = require('url');
const address = require('address');
const chalk = require('chalk');

function prepareUrls(protocol, host, port, pathname = '/') {
	const formatUrl = hostname =>
		url.format({
			protocol,
			hostname,
			port: port,
			pathname
		});

	const prettyPrintUrl = hostname =>
		url.format({
			protocol,
			hostname,
			port: chalk.bold(port),
			pathname
		});

	let prettyHost, lanUrlForConfig, lanUrlForTerminal;
	if (host === '0.0.0.0') {
		prettyHost = 'localhost';

		try {
			// This can only return an IPv4 address
			lanUrlForConfig = address.ip();
			if (lanUrlForConfig) {
				// Check if the address is a private ip
				// https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
				if (
					/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(
						lanUrlForConfig
					)
				) {
					// Address is private, format it for later use
					lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
				} else {
					// Address is not private, so we will discard it
					lanUrlForConfig = undefined;
				}
			}
		} catch (_error) {
			// ignored
		}
	} else {
		prettyHost = host;
	}

	const localUrlForTerminal = prettyPrintUrl(prettyHost);
	const localUrlForBrowser = formatUrl(prettyHost);
	return {
		lanUrlForConfig,
		lanUrlForTerminal,
		localUrlForTerminal,
		localUrlForBrowser
	};
}

module.exports = prepareUrls;
