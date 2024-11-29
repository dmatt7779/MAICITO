<?php
    namespace Developer\Ceipa\config;

    enum Jwt:string{
        case PRIVATE = <<<EOD
        -----BEGIN RSA PRIVATE KEY-----
        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
        -----END RSA PRIVATE KEY-----
        EOD;
        case PUBLIC = <<<EOD
        -----BEGIN PUBLIC KEY-----
        MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAnTNXDkAMPwG57VCCMfBY
        Y56lobHJxiXRhyW1PeCK4QEDuM37rHi2YqMr8H7iiS82t/Y1w+ZKxEg8d2ny9WyE
        +tjlxjcb6WaZfdrPB3JlfWxBTQBVKxaabi1EPQpo/Cj1f8saVkEUnPxAcn/BmFXk
        DYqJsENg7rgzUH0vg4+bRjcKfyrR59ABM2XZDc1FMrZuItnfiDPD8+iI3T52reoc
        tx1DA/HYgniC5iAmREyDn2RC/EPRIaQUdygxiLzUZzn+E4jLImcAnRDpH59emKea
        vIv0uTeyJbPYJSL3G4nqj4PAGxiYpObYHRF7WfF4JuRp/npdv/ljNDczbpvV0/dw
        AYKir9Vsb8Uo6gxMqZonI7cGNRr3SmFKGhyeds/e6Jn9cF+X+MR04PmRMfqhdQBc
        UARD1FdDKDNzwapO77fGEw64rQ5UrSxTQ4l1O6pmbMVGpYR1Fvxsxg95q4u82/hL
        9D2FekiMQHSr1MkhwnpqVBpM6jcEnQj2oH+u0XQZa1g66M5OCYbxKr60lsu/xx2D
        BAB8A0u909jl55TKjBuEtIEYpUuQpZA9KgI4V64dtlNn+jpdjX5np/R3VnU5Ea/B
        DmX6EVselqjdq3WGNHjZgRQvh1n/l7LSEvebj6zD5m4zbd9acaQ5QAKq7KYy9nNm
        11w1T0PlmTXK3ujXSzm2micCAwEAAQ==
        -----END PUBLIC KEY-----
        EOD;
        case TYPE = 'RS256';
    };