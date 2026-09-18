package com.digipay.auth.service;

import com.digipay.auth.config.KeycloakProperties;
import com.digipay.auth.dto.LoginRequest;
import com.digipay.auth.dto.RegisterRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class KeycloakAdminService {

    private final KeycloakProperties properties;
    private final RestClient restClient;

    public KeycloakAdminService(KeycloakProperties properties) {
        this.properties = properties;

        this.restClient = RestClient.builder()
                .baseUrl(properties.getServerUrl())
                .build();
    }

    public void registerUser(RegisterRequest request) {

        String adminAccessToken = getServiceAccountToken();

        createUser(request, adminAccessToken);

        String userId = findUserId(request.getEmail(), adminAccessToken);

        assignMakerRole(userId, adminAccessToken);
    }

    private String getServiceAccountToken() {

        String tokenUrl =
                properties.getServerUrl()
                        + "/realms/"
                        + properties.getRealm()
                        + "/protocol/openid-connect/token";

        Map<String, Object> response =
                restClient
                        .post()
                        .uri(tokenUrl)
                        .contentType(
                                MediaType.APPLICATION_FORM_URLENCODED
                        )
                        .body(
                                "grant_type=client_credentials"
                                        + "&client_id="
                                        + properties.getClientId()
                                        + "&client_secret="
                                        + properties.getClientSecret()
                        )
                        .retrieve()
                        .body(Map.class);

        if (response == null ||
                response.get("access_token") == null) {

            throw new RuntimeException(
                    "Unable to obtain Keycloak service account token"
            );
        }

        return response.get("access_token").toString();
    }

    private void createUser(
            RegisterRequest request,
            String accessToken) {

        Map<String, Object> user = Map.of(
                "username", request.getEmail(),
                "email", request.getEmail(),
                "firstName", request.getFirstName(),
                "lastName", request.getLastName(),
                "enabled", true,
                "emailVerified", true,
                "credentials", List.of(
                        Map.of(
                                "type", "password",
                                "value", request.getPassword(),
                                "temporary", false
                        )
                )
        );

        restClient
                .post()
                .uri(
                        "/admin/realms/"
                                + properties.getRealm()
                                + "/users"
                )
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + accessToken
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(user)
                .retrieve()
                .toBodilessEntity();
    }

    private String findUserId(
            String email,
            String accessToken) {

        List<Map<String, Object>> users =
                restClient
                        .get()
                        .uri(uriBuilder ->
                                uriBuilder
                                        .path(
                                                "/admin/realms/"
                                                        + properties.getRealm()
                                                        + "/users"
                                        )
                                        .queryParam("email", email)
                                        .queryParam("exact", true)
                                        .build()
                        )
                        .header(
                                HttpHeaders.AUTHORIZATION,
                                "Bearer " + accessToken
                        )
                        .retrieve()
                        .body(List.class);

        if (users == null || users.isEmpty()) {
            throw new RuntimeException(
                    "User was created but could not be found"
            );
        }

        return users.get(0)
                .get("id")
                .toString();
    }

    private void assignMakerRole(
            String userId,
            String accessToken) {

        Map<String, Object> role =
                restClient
                        .get()
                        .uri(
                                "/admin/realms/"
                                        + properties.getRealm()
                                        + "/roles/"
                                        + properties.getDefaultRole()
                        )
                        .header(
                                HttpHeaders.AUTHORIZATION,
                                "Bearer " + accessToken
                        )
                        .retrieve()
                        .body(Map.class);

        if (role == null || role.get("id") == null) {
            throw new RuntimeException(
                    "Role "
                            + properties.getDefaultRole()
                            + " does not exist in Keycloak"
            );
        }

        restClient
                .post()
                .uri(
                        "/admin/realms/"
                                + properties.getRealm()
                                + "/users/"
                                + userId
                                + "/role-mappings/realm"
                )
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + accessToken
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(List.of(role))
                .retrieve()
                .toBodilessEntity();
    }

    public Map<String, Object> login(LoginRequest request) {

        String tokenUrl =
                properties.getServerUrl()
                        + "/realms/"
                        + properties.getRealm()
                        + "/protocol/openid-connect/token";

        MultiValueMap<String, String> formData =
                new LinkedMultiValueMap<>();

        formData.add("grant_type", "password");
        formData.add("client_id", properties.getClientId());
        formData.add("client_secret", properties.getClientSecret());
        formData.add("username", request.getEmail());
        formData.add("password", request.getPassword());

        return restClient
                .post()
                .uri(tokenUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .body(Map.class);
    }
}