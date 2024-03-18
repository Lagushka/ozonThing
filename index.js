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
  progressIndicatorCircle.style.transformOrigin = 'center';

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

const ProgressInput = () => {
  const label = document.createElement('label');
  label.textContent = 'Value';
  label.style.display = 'inline-block';
  label.style.display = 'flex';
  label.style.flexDirection = 'row-reverse';
  label.style.alignItems = 'center';
  label.style.gap = '15px';
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
  progressInput.setAttribute('type', 'number');
  progressInput.setAttribute('min', '0');
  progressInput.setAttribute('max', '100');
  progressInput.setAttribute('value', '50');
  progressInput.style.width = '50px';
  progressInput.style.height = '32px';
  progressInput.style.padding = '5px 7px';
  progressInput.style.borderRadius = '25px';
  progressInput.style.border = '1px solid black';
  progressInput.style.textAlign = 'center';
  progressInput.style.boxSizing = 'border-box';

  label.appendChild(progressInput);

  return label;
};

const Checkbox = (text) => {
  const label = document.createElement('label');
  label.textContent = text;
  label.style.display = 'inline-block';
  label.style.display = 'flex';
  label.style.flexDirection = 'row-reverse';
  label.style.alignItems = 'center';
  label.style.gap = '15px';

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.style.display = 'none';
  checkbox.onclick = () => {
    console.log(checkbox.checked);
  };
  label.appendChild(checkbox);

  const slider = document.createElement('button');
  slider.classList.add('progressSlider');
  slider.style.border = 'none';
  slider.style.position = 'relative';
  slider.style.width = '50px';
  slider.style.height = '32px';
  slider.style.transition = '.5s';
  slider.style.backgroundColor = '#dfe6f0';
  slider.style.borderRadius = '25px';
  slider.style.padding = 0;

  document.styleSheets[0].insertRule(
    `.progressSlider::before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 4px;
  top: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%
}`,
    0,
  );

  document.styleSheets[0].insertRule(
    `input:checked + .progressSlider {
  background-color: #005dff !important;
}`,
    0,
  );

  document.styleSheets[0].insertRule(
    `input:focus + .progressSlider {
  box-shadow: 0 0 1px #2196F3;
}`,
    0,
  );

  document.styleSheets[0].insertRule(
    `input:checked + .progressSlider::before {
  transform: translateX(18px);
}
`,
    0,
  );
  slider.onclick = () => {
    checkbox.click();
  };

  label.appendChild(slider);

  return { checkboxInput: checkbox, label };
};

const StateControllers = () => {
  const controllersBlock = document.createElement('div');
  controllersBlock.style.width = `fit-content`;
  controllersBlock.style.display = 'flex';
  controllersBlock.style.flexDirection = 'column';
  controllersBlock.style.alignItems = 'flex-start';
  controllersBlock.style.gap = '10px';

  const progressInput = ProgressInput();
  controllersBlock.appendChild(progressInput);

  const { label: animateCheckbox, checkboxInput: animateInput } =
    Checkbox('Animate');
  controllersBlock.appendChild(animateCheckbox);

  const { label: hideCheckbox, checkboxInput: hideInput } = Checkbox('Hide');
  controllersBlock.appendChild(hideCheckbox);

  return { controllersBlock, progressInput, animateInput, hideInput };
};

const connectSvgToControllers = (
  circleRadius,
  loaderCircleSvg,
  progressIndicatorCircle,
  progressInput,
  animateInput,
) => {
  progressInput.onchange = (event) => {
    const { indicatorLength } = calculateProgressLengths(
      circleRadius,
      event.target.value,
    );
    progressIndicatorCircle.setAttribute(
      'stroke-dashoffset',
      `${indicatorLength}px`,
    );
  };

  animateInput.onclick = () => {
    if (animateInput.checked) {
      progressIndicatorCircle.animate(
        [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
        {
          duration: 1000,
          iterations: Infinity,
        },
      );
    } else {
      const [animation] = progressIndicatorCircle.getAnimations();
      if (animation) {
        animation.cancel();
      }
    }
  };
};

const Progress = (parentBlock, blockWidth, blockHeight, strokeWidth = 16) => {
  const progressBlock = document.createElement('div');
  progressBlock.style.width = `${blockWidth}px`;
  progressBlock.style.height = `${blockHeight}px`;
  parentBlock.appendChild(progressBlock);

  const circleRadius = 70;

  const { commonSVG: loaderCircleSvg, progressIndicatorCircle } = LoaderSVG(
    circleRadius,
    strokeWidth,
  );
  const { controllersBlock, progressInput, animateInput } = StateControllers();
  connectSvgToControllers(
    circleRadius,
    loaderCircleSvg,
    progressIndicatorCircle,
    progressInput,
    animateInput,
  );
  progressBlock.appendChild(loaderCircleSvg);
  progressBlock.appendChild(controllersBlock);
};

Progress(document.body, 400, 600);
