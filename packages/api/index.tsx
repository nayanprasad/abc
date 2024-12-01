import type {AxiosInstance} from "axios";
import axios from "axios";
import {BillboardControllerApi, OrganizationControllerApi, UserControllerApi,} from "./src/axios";


export class AxiosAPI {
    private static frontEndInstance: AxiosAPI;
    private static frontEndAxiosInstance: AxiosInstance;

    private static backendInstance: AxiosAPI;
    private static backendEndAxiosInstance: AxiosInstance;

    private static baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    public static getFrontEndAxiosInstance(): AxiosInstance {
        return this.frontEndAxiosInstance
    }

    public static getInstance(): AxiosAPI {
        if (!AxiosAPI.frontEndInstance) {
            AxiosAPI.frontEndAxiosInstance = axios.create({
                baseURL: process.env.NEXT_PUBLIC_API_URL,
                headers: {
                    "X-Organization-ID": localStorage.getItem("organizationId"),
                },
            });

            AxiosAPI.frontEndAxiosInstance.interceptors.request.use(
                async (request) => {
                    //todo: validate token here
                    return request;
                },
            );
            AxiosAPI.frontEndInstance = new AxiosAPI();
        }
        return AxiosAPI.frontEndInstance;
    }

    public static getBackendInstance(): AxiosAPI {
        if (!AxiosAPI.backendInstance) {
            AxiosAPI.backendEndAxiosInstance = axios.create({
                baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
            });
            AxiosAPI.backendInstance = new AxiosAPI();
        }
        return AxiosAPI.backendInstance;
    }

    public userService: UserControllerApi;
    public organizationService: OrganizationControllerApi;
    public billboardService: BillboardControllerApi;

    constructor() {
        this.userService = new UserControllerApi(undefined, AxiosAPI.baseApiUrl, AxiosAPI.frontEndAxiosInstance);
        this.organizationService = new OrganizationControllerApi(undefined, AxiosAPI.baseApiUrl, AxiosAPI.frontEndAxiosInstance);
        this.billboardService = new BillboardControllerApi(undefined, AxiosAPI.baseApiUrl, AxiosAPI.frontEndAxiosInstance);
    }

}
