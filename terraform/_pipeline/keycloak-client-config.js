module.exports.process = function (p) {
    const baseUrl = `https://${p.endpoint}`
    const clientId = baseUrl
    return {
        clientId: clientId,
        name: 'AWS ElasticSearch',
        protocol: 'saml',
        frontchannelLogout: true,
        fullScopeAllowed: false,
        attributes: {
            'saml.assertion.signature': 'false',
            'saml.multivalued.roles': 'false',
            'saml.force.post.binding': 'true',
            'saml.encrypt': 'false',
            'saml_idp_initiated_sso_url_name': 'apm',
            'saml.server.signature': 'true',
            'saml.server.signature.keyinfo.ext': 'false',
            'exclude.session.state.from.auth.response': 'false',
            'saml.signature.algorithm': 'RSA_SHA256',
            'client_credentials.use_refresh_token': 'false',
            'saml_force_name_id_format': 'false',
            'saml.client.signature': 'false',
            'tls.client.certificate.bound.access.tokens': 'false',
            'saml.authnstatement': 'true',
            'display.on.consent.screen': 'false',
            'saml_name_id_format': 'username',
            'saml_signature_canonicalization_method': 'http://www.w3.org/2001/10/xml-exc-c14n#',
            'saml.onetimeuse.condition': 'false'
        },
        baseUrl: `${baseUrl}/_plugin/kibana/`,
        redirectUris: [`${baseUrl}/*`],
        defaultClientScopes: [ 'web-origins', 'profile', 'email' ],
        roles: [{name:'kibana_user'}, {name: 'all_access'}, {name: 'irs-developer'}, {name: 'nrm-read-all'}],
        protocolMappers: [
            {name: 'roles', protocol: 'saml', protocolMapper: 'saml-role-list-mapper', consentRequired: false, config: {single:'true', 'attribute.nameformat': 'Basic', 'attribute.name': 'roles', 'friendly.name': 'roles'}},
        ]
    }
}
