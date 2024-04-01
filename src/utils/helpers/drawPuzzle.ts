import { beforeItemWidth, itemWidth } from '@utils/helpers/widthByStrLenght';

export default function drawPuzzle(
    col: number,
    row: number,
    totalRows: number,
    textExample: string,
    puzzleImg: HTMLImageElement,
    extraWidth = 8,
) {
    const imgNode = puzzleImg;
    const imgRect = imgNode.getBoundingClientRect();
    const textExampleArr = textExample.split(' ');

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const extraWidthCopy = col !== textExampleArr.length - 1 ? extraWidth : 0;

    tempCanvas.width = itemWidth(col, imgRect.width, textExampleArr) + extraWidthCopy;

    tempCanvas.height = imgRect.height / totalRows;

    if (tempCtx) {
        const h = tempCanvas.height;
        tempCtx.save();
        tempCtx.fillStyle = 'black';

        tempCtx.drawImage(
            imgNode,
            beforeItemWidth(col, imgNode.naturalWidth, textExampleArr),
            (imgNode.naturalHeight / totalRows) * row,
            itemWidth(col, imgNode.naturalWidth, textExampleArr),
            imgNode.naturalHeight / totalRows,
            0,
            0,
            itemWidth(col, imgRect.width, textExampleArr),
            tempCanvas.height,
        );
        if (col !== 0) {
            tempCtx.globalCompositeOperation = 'destination-out';
            tempCtx.arc(0, h / 2, extraWidth - 1, 0, Math.PI * 2, true);
            tempCtx.fill();
            tempCtx.globalCompositeOperation = 'source-over';
        }

        if (col < textExampleArr.length) {
            tempCtx.beginPath();
            tempCtx.arc(
                itemWidth(col, imgRect.width, textExampleArr),
                h / 2,
                extraWidth - 1,
                0,
                2 * Math.PI,
            );

            tempCtx.clip();
            tempCtx.drawImage(
                imgNode,
                beforeItemWidth(col, imgNode.naturalWidth, textExampleArr) +
                    itemWidth(col, imgNode.naturalWidth, textExampleArr),
                (imgNode.naturalHeight / totalRows) * row,
                itemWidth(col, imgNode.naturalWidth, textExampleArr) + 8,
                imgNode.naturalHeight / totalRows,
                itemWidth(col, imgRect.width, textExampleArr),
                0,
                itemWidth(col, imgRect.width, textExampleArr) + extraWidthCopy,
                tempCanvas.height,
            );
            tempCtx.closePath();
            tempCtx.restore();
        }
    }

    return { canvas: tempCanvas, extra: extraWidth };
}
