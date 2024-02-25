import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, inject } from "@angular/core";
import { TagModel, TagModelPost } from "../models/tag.model";
import { Observable } from "rxjs";
import { BASE_API_URL } from "../conf/basic.conf";
import { BackUrlState } from "../utils/back-url.conf";

@Injectable()
export class TagRepositoryService {
    // private baseUrl = `${BASE_API_URL}/tags`;
    private urlState = inject(BackUrlState);
    private baseUrl() { return `${this.urlState.getBackUrl()}/tags`; }

    private http: HttpClient = inject(HttpClient);

    getAllTags(): Observable<TagModel[]> {
        return this.http.get<TagModel[]>(this.baseUrl());
    }

    getTagById(id: string): Observable<TagModel> {
        return this.http.get<TagModel>(`${this.baseUrl()}/${id}`);
    }

    createTag(tag: Partial<TagModelPost>): Observable<TagModel> {
        return this.http.post<TagModel>(this.baseUrl(), tag);
    }

    patchTag(id: string, tag: Partial<TagModelPost>): Observable<TagModel> {
        return this.http.patch<TagModel>(`${this.baseUrl()}/${id}`, tag);
    }

    deleteTag(id: string): Observable<TagModel> {
        return this.http.delete<TagModel>(`${this.baseUrl()}/${id}`);
    }
}