export type MatlabDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface MatlabTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: MatlabDifficulty;
  exercises: number;
}

export interface MatlabModule {
  id: number;
  title: string;
  description: string;
  topics: MatlabTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const matlabModules: MatlabModule[] = [
  {
    id: 1,
    title: "MATLAB Fundamentals",
    description: "Learn the basics of MATLAB for numerical computing and visualization.",
    topics: [
      {
        id: "matlab-intro",
        title: "Introduction to MATLAB",
        content:
          "MATLAB (Matrix Laboratory) is a high-level programming environment designed for numerical computing, data analysis, and visualization. In this topic you will learn about MATLAB's history, its strengths in engineering and scientific computing, and the MATLAB desktop environment including the Command Window, Workspace, and Editor.\n\nBy the end you will understand why MATLAB is widely used in academia and industry for technical computing.",
        duration: "40 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "matlab-matrices",
        title: "Matrices & Arrays",
        content:
          "Everything in MATLAB is a matrix. In this topic you will create vectors and matrices using various methods: direct entry, colon operator, and built-in functions like zeros, ones, eye, and rand. You will learn indexing with parentheses, logical indexing, and the difference between row and column vectors.\n\nBy the end you will be comfortable creating and accessing matrix elements, which is fundamental to all MATLAB programming.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "matlab-operations",
        title: "Matrix Operations",
        content:
          "MATLAB excels at matrix operations. In this topic you will perform matrix arithmetic: addition, subtraction, multiplication, and division. You will understand the difference between matrix operations and element-wise operations (using the dot prefix). You will also compute transposes, inverses, and determinants.\n\nBy the end you will be able to perform linear algebra operations essential for engineering and scientific applications.",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "matlab-scripts",
        title: "Scripts & Functions",
        content:
          "MATLAB code can be organized into scripts and functions. In this topic you will create script files (.m files) for automating sequences of commands. You will define functions with inputs, outputs, and local variables. You will understand the difference between scripts and functions and when to use each.\n\nBy the end you will be able to write reusable MATLAB code in well-organized files.",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 5
      }
    ],
    duration: "3.3 hours",
    exercises: 21,
    completed: false,
    codeExample: `% MATLAB Fundamentals

% Creating matrices
A = [1 2 3; 4 5 6; 7 8 9];
B = zeros(3, 3);
C = ones(3, 3);
I = eye(3);

% Vector operations
x = 1:10;           % Row vector 1 to 10
y = linspace(0, 1, 5);  % 5 points from 0 to 1

% Matrix operations
D = A * I;          % Matrix multiplication
E = A .* C;         % Element-wise multiplication
F = A';             % Transpose

% Indexing
element = A(2, 3);  % Row 2, Column 3
row = A(1, :);      % First row
col = A(:, 2);      % Second column

% Function definition (in separate file or at end)
% function result = mySquare(x)
%     result = x.^2;
% end

% Display results
disp('Matrix A:');
disp(A);
disp(['Element (2,3): ', num2str(element)]);`
  },
  {
    id: 2,
    title: "Data Visualization",
    description: "Create publication-quality plots and visualizations in MATLAB.",
    topics: [
      {
        id: "matlab-2d-plots",
        title: "2D Plotting",
        content:
          "MATLAB provides powerful 2D plotting capabilities. In this topic you will create line plots with plot(), scatter plots, bar charts, and histograms. You will customize plots with titles, labels, legends, and different line styles and colors.\n\nBy the end you will be able to create informative 2D visualizations for data analysis.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "matlab-3d-plots",
        title: "3D Plotting",
        content:
          "MATLAB excels at 3D visualization. In this topic you will create 3D line plots with plot3(), surface plots with surf() and mesh(), and contour plots. You will control viewing angles, add colorbars, and create animated visualizations.\n\nBy the end you will be able to visualize 3D data and mathematical surfaces effectively.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      },
      {
        id: "matlab-subplots",
        title: "Multiple Plots & Figures",
        content:
          "Complex analyses often require multiple related plots. In this topic you will use subplot() to create grids of plots, manage multiple figure windows, and use tiledlayout for modern subplot arrangements. You will also learn to save figures in various formats.\n\nBy the end you will be able to create professional multi-panel figures for reports and publications.",
        duration: "45 min",
        difficulty: "Intermediate",
        exercises: 5
      },
      {
        id: "matlab-customization",
        title: "Advanced Customization",
        content:
          "Publication-quality figures require fine-grained control. In this topic you will work with figure and axes properties, create custom colormaps, add annotations and text, and use LaTeX for mathematical notation in labels. You will also create interactive plots.\n\nBy the end you will be able to create polished, publication-ready visualizations.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      }
    ],
    duration: "3.3 hours",
    exercises: 21,
    completed: false,
    codeExample: `% Data Visualization in MATLAB

% Sample data
x = linspace(0, 2*pi, 100);
y1 = sin(x);
y2 = cos(x);

% 2D Plot with customization
figure;
plot(x, y1, 'b-', 'LineWidth', 2);
hold on;
plot(x, y2, 'r--', 'LineWidth', 2);
hold off;

title('Trigonometric Functions', 'FontSize', 14);
xlabel('x (radians)');
ylabel('y');
legend('sin(x)', 'cos(x)', 'Location', 'best');
grid on;

% 3D Surface plot
figure;
[X, Y] = meshgrid(-2:0.1:2, -2:0.1:2);
Z = X .* exp(-X.^2 - Y.^2);
surf(X, Y, Z);
colorbar;
title('3D Surface: z = x * exp(-x^2 - y^2)');
xlabel('X'); ylabel('Y'); zlabel('Z');

% Subplots
figure;
subplot(2, 2, 1);
plot(x, sin(x));
title('sin(x)');

subplot(2, 2, 2);
plot(x, cos(x));
title('cos(x)');

subplot(2, 2, 3);
plot(x, tan(x));
title('tan(x)');
ylim([-5, 5]);

subplot(2, 2, 4);
bar([1 2 3 4], [10 15 7 12]);
title('Bar Chart');`
  },
  {
    id: 3,
    title: "Numerical Methods",
    description: "Solve mathematical problems using MATLAB's numerical computing capabilities.",
    topics: [
      {
        id: "matlab-linear-algebra",
        title: "Linear Algebra",
        content:
          "MATLAB was built for linear algebra. In this topic you will solve systems of linear equations using backslash (\\\\), compute eigenvalues and eigenvectors, perform matrix decompositions (LU, QR, SVD), and understand matrix rank and condition number.\n\nBy the end you will be able to solve linear algebra problems common in engineering and science.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "matlab-ode",
        title: "Differential Equations",
        content:
          "Many physical systems are described by differential equations. In this topic you will solve ordinary differential equations (ODEs) using ode45 and other solvers. You will handle initial value problems, systems of ODEs, and understand solver options for accuracy and efficiency.\n\nBy the end you will be able to model and simulate dynamic systems.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "matlab-optimization",
        title: "Optimization",
        content:
          "Finding optimal solutions is essential in engineering design. In this topic you will use fminunc for unconstrained optimization, fmincon for constrained problems, and understand optimization options. You will also explore linear programming with linprog.\n\nBy the end you will be able to formulate and solve optimization problems in MATLAB.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "matlab-interpolation",
        title: "Interpolation & Curve Fitting",
        content:
          "Real-world data often needs interpolation or fitting. In this topic you will use interp1 and interp2 for interpolation, polyfit and polyval for polynomial fitting, and the Curve Fitting Toolbox for advanced fitting. You will understand when to use each approach.\n\nBy the end you will be able to work with discrete data and create continuous approximations.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      }
    ],
    duration: "3.7 hours",
    exercises: 24,
    completed: false,
    codeExample: `% Numerical Methods in MATLAB

% Linear system: Ax = b
A = [3 1; 1 2];
b = [9; 8];
x = A \\ b;
disp('Solution to linear system:');
disp(x);

% Eigenvalues and eigenvectors
[V, D] = eig(A);
disp('Eigenvalues:');
disp(diag(D));

% ODE: dy/dt = -2y, y(0) = 1
odefun = @(t, y) -2*y;
[t, y] = ode45(odefun, [0 5], 1);

figure;
plot(t, y, 'b-', t, exp(-2*t), 'r--');
legend('Numerical', 'Analytical');
title('ODE Solution');

% Optimization: minimize f(x) = (x-3)^2 + 1
fun = @(x) (x-3)^2 + 1;
x0 = 0;
xmin = fminunc(fun, x0);
disp(['Minimum at x = ', num2str(xmin)]);

% Curve fitting
xdata = 1:10;
ydata = 2*xdata + 1 + randn(1, 10);
p = polyfit(xdata, ydata, 1);
disp(['Fitted line: y = ', num2str(p(1)), 'x + ', num2str(p(2))]);`
  },
  {
    id: 4,
    title: "Signal Processing & Simulink",
    description: "Analyze signals and build dynamic system models.",
    topics: [
      {
        id: "matlab-signals",
        title: "Signal Processing Basics",
        content:
          "MATLAB is widely used for signal processing. In this topic you will generate and analyze signals, compute the FFT for frequency analysis, and design and apply filters. You will understand sampling, aliasing, and the Nyquist theorem.\n\nBy the end you will be able to perform fundamental signal processing tasks in MATLAB.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "matlab-filters",
        title: "Filter Design",
        content:
          "Filters are essential for signal processing. In this topic you will design FIR and IIR filters using designfilt and butter/cheby1/ellip. You will analyze filter frequency response and apply filters to signals with filter() and filtfilt().\n\nBy the end you will be able to design and implement digital filters for various applications.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "matlab-simulink",
        title: "Introduction to Simulink",
        content:
          "Simulink is MATLAB's graphical environment for modeling dynamic systems. In this topic you will create simple Simulink models, connect blocks, run simulations, and analyze results. You will understand the relationship between Simulink and MATLAB.\n\nBy the end you will be able to build basic Simulink models for system simulation.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 5
      },
      {
        id: "matlab-control",
        title: "Control Systems",
        content:
          "MATLAB and Simulink are standard tools for control engineering. In this topic you will create transfer functions, analyze system stability with pole-zero plots and Bode diagrams, and design PID controllers. You will simulate closed-loop systems.\n\nBy the end you will be able to analyze and design basic control systems.",
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 6
      }
    ],
    duration: "3.8 hours",
    exercises: 23,
    completed: false,
    codeExample: `% Signal Processing in MATLAB

% Generate a signal with two frequencies
Fs = 1000;              % Sampling frequency
t = 0:1/Fs:1-1/Fs;      % Time vector
f1 = 50; f2 = 120;      % Frequencies
signal = sin(2*pi*f1*t) + 0.5*sin(2*pi*f2*t);

% Add noise
noisy_signal = signal + 0.5*randn(size(t));

% FFT analysis
N = length(signal);
f = (0:N-1)*Fs/N;
Y = fft(noisy_signal);

figure;
subplot(2, 1, 1);
plot(t(1:100), noisy_signal(1:100));
title('Noisy Signal (Time Domain)');
xlabel('Time (s)');

subplot(2, 1, 2);
plot(f(1:N/2), abs(Y(1:N/2)));
title('Frequency Spectrum');
xlabel('Frequency (Hz)');

% Low-pass filter design
fc = 80;  % Cutoff frequency
[b, a] = butter(4, fc/(Fs/2), 'low');

% Apply filter
filtered_signal = filtfilt(b, a, noisy_signal);

figure;
plot(t(1:100), noisy_signal(1:100), 'b');
hold on;
plot(t(1:100), filtered_signal(1:100), 'r', 'LineWidth', 2);
legend('Noisy', 'Filtered');
title('Filter Effect');`
  }
];




