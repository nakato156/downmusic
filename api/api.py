from flask import Blueprint, send_file
import os
import base64
from flask_cors import cross_origin
from pytube import YouTube

api_DM = Blueprint("api", __name__, url_prefix="/api/v1")
path = "/downloads"


@cross_origin
@api_DM.get("/download/<string:videoID>")
def download(videoID):
    url = f"https://www.youtube.com/watch?v={videoID}"
    yt = YouTube(url)
    lstst = yt.streams.filter(only_audio=True, mime_type="audio/mp4")
    down_video = yt.streams.get_by_itag(lstst[0].itag)
    dpath = down_video.download(path, filename=f"{yt.title.split(' ')[0]}")
    return send_file(dpath)


@api_DM.get("infor/<string:VideoID>")
def info_video(videoID):
    url = f"https://www.youtube.com/watch?v={videoID}"
    yt = YouTube(url)
    return {
        "title": yt.title,
        "author": yt.author,
        "description": yt.description,
        "duration": yt.length,
        "age_restricted": yt.age_restricted,
        "channel_id": yt.channel_id,
    }
