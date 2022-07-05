"use strict";

export function VideoAnalyzer()
{
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    let analyze = function( video )
    {
        if( !video )
        {
            return { "brightness": 0, "contrast": 0 };
        }

        let width = video.videoWidth;
        let height = video.videoHeight;
        if( width <= 0 || height <= 0 )
        {
            return { "brightness": 0, "contrast": 0 };
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        let imageData = context.getImageData(0, 0, width, height);
        let pixels = imageData.data;

        let average = 0;
        let variance = 0;
        let standardDeviation = 0;

        // Calculate incremental average.
        let n = 1;
        for( let i = 0; i < pixels.length; i+=4 )
        {
            let r = pixels[i] / 255;
            let g = pixels[i + 1] / 255;
            let b = pixels[i + 2] / 255;
            let y = 0.299 * r + 0.587 * g + 0.114 * b;

            average += (y - average) / n;

            n++;
        }

        // Calculate variance and standard deviation.
        for( let i = 0; i < pixels.length; i+=4 )
        {
            let r = pixels[i] / 255;
            let g = pixels[i + 1] / 255;
            let b = pixels[i + 2] / 255;
            let y = 0.299 * r + 0.587 * g + 0.114 * b;

            variance += Math.pow(y - average, 2);
        }

        variance /= n;
        standardDeviation = Math.sqrt(variance);

        let brightness = average;
        let contrast = standardDeviation / average;

        return { "brightness": brightness, "contrast": contrast };
    };

    return {
        analyze
    };
}