const calculateProgressLengths = (radius, progress) => {
  const circleLength = 2 * Math.PI * radius;
  const indicatorLength = circleLength - (progress / 100) * circleLength;
  return { circleLength, indicatorLength };
};

const defineElementAttributes = (elem, attributes) => {
  const attrNames = Object.keys(attributes);
  for (const attr of attrNames) {
    elem.setAttribute(attr, attributes[attr]);
  }
};

const setProgressInputChangeHandler = (
  input,
  progressValue,
  radius,
  indicatorCircle,
) => {
  input.onchange = (event) => {
    if (!event.target.value) {
      event.target.value = progressValue.toString();
    }

    const { indicatorLength } = calculateProgressLengths(
      radius,
      Number(progressValue),
    );
    indicatorCircle.setAttribute('stroke-dashoffset', `${indicatorLength}px`);
  };
};

const setProgressInputHandler = (input, radius, indicatorCircle) => {
  input.oninput = (event) => {
    const regExp = /^([0-9]|[1-9][0-9]|100)$/;
    let inputValue = event.target.value;
    if (!regExp.test(inputValue)) {
      event.target.value = inputValue = inputValue.substring(
        0,
        inputValue.length - 1,
      );
    }

    const { indicatorLength } = calculateProgressLengths(
      radius,
      Number(inputValue),
    );
    indicatorCircle.setAttribute('stroke-dashoffset', `${indicatorLength}px`);
  };
};

const setAnimateOptionInputHandler = (input, indicatorCircle) => {
  input.onclick = () => {
    if (input.checked) {
      indicatorCircle.animate(
        [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
        {
          duration: 1000,
          iterations: Infinity,
        },
      );
    } else {
      const [animation] = indicatorCircle.getAnimations();
      if (animation) {
        animation.cancel();
      }
    }
  };
};

const setHideOptionInputHandler = (input, loaderSvg) => {
  input.onclick = () => {
    if (input.checked) {
      loaderSvg.style.transition = 'opacity .5s ease-in';
      loaderSvg.style.opacity = '0';
    } else {
      loaderSvg.style.opacity = '1';
    }
  };
};

const connectSvgToControllers = (
  circleRadius,
  loaderCircleSvg,
  progressIndicatorCircle,
  progressInput,
  animateInput,
  hideInput,
  defaultProgressValue,
) => {
  setProgressInputChangeHandler(
    progressInput,
    defaultProgressValue,
    circleRadius,
    progressIndicatorCircle,
  );
  setProgressInputHandler(progressInput, circleRadius, progressIndicatorCircle);

  setAnimateOptionInputHandler(animateInput, progressIndicatorCircle);

  setHideOptionInputHandler(hideInput, loaderCircleSvg);
};

const LoaderSVG = (
  radius,
  strokeWidth,
  secondaryColor,
  defaultProgressValue,
) => {
  const commonSVG = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  );

  const svgSide = radius * 2 + strokeWidth;

  const commonSVGAttrs = {
    width: svgSide.toString(),
    height: svgSide.toString(),
    viewBox: `0 0 ${svgSide} ${svgSide}`,
  };
  defineElementAttributes(commonSVG, commonSVGAttrs);

  commonSVG.setAttributeNS(
    'http://www.w3.org/2000/xmlns/',
    'xmlns:xlink',
    'http://www.w3.org/1999/xlink',
  );
  commonSVG.style.transform = 'rotate(-90deg)';

  const progressBarCircle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  const circleCenterCoords = radius + Math.round(strokeWidth / 2);

  const progressBarCircleAttrs = {
    r: radius,
    cx: circleCenterCoords,
    cy: circleCenterCoords,
    fill: 'transparent',
    stroke: '#eef3f6',
    'stroke-width': `${strokeWidth}px`,
  };
  defineElementAttributes(progressBarCircle, progressBarCircleAttrs);

  commonSVG.appendChild(progressBarCircle);

  const progressIndicatorCircle = progressBarCircle.cloneNode();
  progressIndicatorCircle.classList.add('progressIndicator');

  const { circleLength, indicatorLength } = calculateProgressLengths(
    radius,
    defaultProgressValue,
  );

  const progressIndicatorCircleAttrs = {
    stroke: secondaryColor,
    'stroke-dasharray': `${circleLength}px`,
    'stroke-dashoffset': `${indicatorLength}px`,
  };
  defineElementAttributes(
    progressIndicatorCircle,
    progressIndicatorCircleAttrs,
  );

  commonSVG.appendChild(progressIndicatorCircle);

  return { commonSVG, progressIndicatorCircle };
};

const ProgressControlInput = () => {
  const label = document.createElement('label');
  label.classList.add('progressController');
  label.textContent = 'Value';
  const progressInput = document.createElement('input');
  document.styleSheets[0].insertRule(
    `#progressInput::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }`,
    0,
  );
  document.styleSheets[0].insertRule(
    `#progressInput {
    -moz-appearance: textfield;
  }`,
    0,
  );
  progressInput.id = 'progressInput';
  const progressInputAttrs = {
    type: 'number',
    value: '50',
  };
  defineElementAttributes(progressInput, progressInputAttrs);

  label.appendChild(progressInput);

  return label;
};

const Checkbox = (text, secondaryColor) => {
  const label = document.createElement('label');
  label.classList.add('checkboxLabel');
  label.textContent = text;

  const checkbox = document.createElement('input');
  checkbox.id = 'hiddenInput';
  checkbox.setAttribute('type', 'checkbox');
  label.appendChild(checkbox);

  const slider = document.createElement('button');
  slider.classList.add('progressSlider');

  document.styleSheets[0].insertRule(
    `input:checked + .progressSlider {
  background-color: ${secondaryColor} !important;
}`,
    0,
  );

  slider.onclick = () => {
    checkbox.click();
  };

  label.appendChild(slider);

  return { checkboxInput: checkbox, label };
};

const StateControlElements = (secondaryColor) => {
  const controllersBlock = document.createElement('div');
  controllersBlock.classList.add('stateControllers');

  const progressInput = ProgressControlInput();
  controllersBlock.appendChild(progressInput);

  const { label: animateCheckbox, checkboxInput: animateInput } = Checkbox(
    'Animate',
    secondaryColor,
  );
  controllersBlock.appendChild(animateCheckbox);

  const { label: hideCheckbox, checkboxInput: hideInput } = Checkbox(
    'Hide',
    secondaryColor,
  );
  controllersBlock.appendChild(hideCheckbox);

  return { controllersBlock, progressInput, animateInput, hideInput };
};

const Progress = ({
  parentBlock,
  strokeWidth = 16,
  secondaryColor = '#005dff',
  defaultProgressValue = 50,
  circleRadius = 65,
}) => {
  const progressBlock = document.createElement('div');
  progressBlock.classList.add('progress');
  parentBlock.appendChild(progressBlock);

  const { commonSVG: loaderCircleSvg, progressIndicatorCircle } = LoaderSVG(
    circleRadius,
    strokeWidth,
    secondaryColor,
    defaultProgressValue,
  );
  const { controllersBlock, progressInput, animateInput, hideInput } =
    StateControlElements(secondaryColor);
  connectSvgToControllers(
    circleRadius,
    loaderCircleSvg,
    progressIndicatorCircle,
    progressInput,
    animateInput,
    hideInput,
    defaultProgressValue,
  );
  progressBlock.appendChild(loaderCircleSvg);
  progressBlock.appendChild(controllersBlock);
};

Progress({ parentBlock: document.body, strokeWidth: 12 });
