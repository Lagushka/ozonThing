const calculateProgressLengths = (radius, progress) => {
  const circleLength = 2 * Math.PI * radius;
  const indicatorLength =
    circleLength - Math.round((progress / 100) * circleLength);
  return { circleLength, indicatorLength };
};

const LoaderSVG = (radius, strokeWidth, defaultProgress = 50) => {
  const commonSVG = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  );

  const svgSide = radius * 2 + strokeWidth;

  commonSVG.setAttribute('width', svgSide.toString());
  commonSVG.setAttribute('height', svgSide.toString());
  commonSVG.setAttributeNS(
    'http://www.w3.org/2000/xmlns/',
    'xmlns:xlink',
    'http://www.w3.org/1999/xlink',
  );
  commonSVG.setAttribute('viewBox', `0 0 ${svgSide} ${svgSide}`);
  commonSVG.style.transform = 'rotate(-90deg)';

  const progressBarCircle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  const circleCenterCoords = radius + Math.round(strokeWidth / 2);
  progressBarCircle.setAttribute('r', radius);
  progressBarCircle.setAttribute('cx', circleCenterCoords);
  progressBarCircle.setAttribute('cy', circleCenterCoords);
  progressBarCircle.setAttribute('fill', 'transparent');
  progressBarCircle.setAttribute('stroke', '#eef3f6');
  progressBarCircle.setAttribute('stroke-width', `${strokeWidth}px`);
  commonSVG.appendChild(progressBarCircle);

  const progressIndicatorCircle = progressBarCircle.cloneNode();
  progressIndicatorCircle.setAttribute('stroke', '#005dff');
  progressIndicatorCircle.style.transition = 'stroke-dashoffset 1s ease-in-out';

  const { circleLength, indicatorLength } = calculateProgressLengths(
    radius,
    defaultProgress,
  );
  progressIndicatorCircle.setAttribute('stroke-dasharray', `${circleLength}px`);

  progressIndicatorCircle.setAttribute(
    'stroke-dashoffset',
    `${indicatorLength}px`,
  );
  commonSVG.appendChild(progressIndicatorCircle);

  return { commonSVG, progressIndicatorCircle };
};

const StateControllers = (blockWidth, blockHeight) => {
  const controllersBlock = document.createElement('div');
  controllersBlock.style.width = `${blockWidth}px`;
  controllersBlock.style.height = `${blockHeight}px`;

  const progressInput = document.createElement('input');
  document.styleSheets[0].insertRule(
    `input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }`,
    0,
  );
  document.styleSheets[0].insertRule(
    `input[type="number"] {
    -moz-appearance: textfield;
  }`,
    0,
  );
  progressInput.setAttribute('type', 'number');
  progressInput.setAttribute('min', '0');
  progressInput.setAttribute('max', '100');
  progressInput.setAttribute('value', '50');
  progressInput.style.width = '35px';
  progressInput.style.height = '20px';
  progressInput.style.padding = '5px 7px';
  progressInput.style.borderRadius = '25px';
  progressInput.style.border = '1px solid black';
  progressInput.style.textAlign = 'center';
  progressInput.style.fontSize = '16px';
  controllersBlock.appendChild(progressInput);

  return { controllersBlock, progressInput };
};

const connectSvgToControllers = (
  circleRadius,
  loaderCircleSvg,
  progressIndicatorCircle,
  progressInput,
) => {
  progressInput.onchange = function (event) {
    const { indicatorLength } = calculateProgressLengths(
      circleRadius,
      event.target.value,
    );
    progressIndicatorCircle.setAttribute(
      'stroke-dashoffset',
      `${indicatorLength}px`,
    );
  };
};

const Progress = (parentBlock, blockWidth, blockHeight, strokeWidth = 16) => {
  const progressBlock = document.createElement('div');
  progressBlock.style.width = `${blockWidth}px`;
  progressBlock.style.height = `${blockHeight}px`;
  parentBlock.appendChild(progressBlock);

  const circleRadius = 90;

  const { commonSVG: loaderCircleSvg, progressIndicatorCircle } = LoaderSVG(
    circleRadius,
    strokeWidth,
  );
  const { controllersBlock, progressInput } = StateControllers(200, 200);
  connectSvgToControllers(
    circleRadius,
    loaderCircleSvg,
    progressIndicatorCircle,
    progressInput,
  );
  progressBlock.appendChild(loaderCircleSvg);
  progressBlock.appendChild(controllersBlock);
};

Progress(document.body, 400, 600);
