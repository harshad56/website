export type RDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface RTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: RDifficulty;
  exercises: number;
}

export interface RModule {
  id: number;
  title: string;
  description: string;
  topics: RTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const rModules: RModule[] = [
  {
    id: 1,
    title: "R Fundamentals",
    description: "Learn the basics of R programming for data analysis and statistics.",
    topics: [
      {
        id: "r-intro",
        title: "Introduction to R",
        content:
          "R is a programming language and environment designed specifically for statistical computing and graphics. In this topic you will learn about R's history, its strengths in data analysis, and why it's widely used in academia, research, and data science. You will install R and RStudio, understand the console and script editor, and run your first commands.\n\nBy the end of this lesson you will understand R's role in the data science ecosystem and be comfortable navigating the RStudio environment.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "r-vectors",
        title: "Vectors & Data Types",
        content:
          "Vectors are the fundamental data structure in R. In this topic you will create numeric, character, and logical vectors using the c() function. You will learn about vector operations, recycling rules, and how R handles mixed types through coercion.\n\nYou will also explore special values like NA, NULL, Inf, and NaN. By the end you will be comfortable creating and manipulating vectors for data analysis tasks.",
        duration: "50 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "r-dataframes",
        title: "Data Frames",
        content:
          "Data frames are R's primary structure for tabular data, similar to spreadsheets or SQL tables. In this topic you will create data frames, access rows and columns using various indexing methods, and add or remove variables. You will learn about the structure of data frames and how they relate to lists.\n\nYou will also practice reading data from CSV files and exploring data with functions like head(), summary(), and str(). By the end you will be able to work with real-world datasets in R.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "r-functions",
        title: "Functions & Control Flow",
        content:
          "Functions allow you to encapsulate reusable logic in R. In this topic you will define functions with arguments and return values, understand default arguments, and work with the ... (ellipsis) for variable arguments. You will also learn control flow with if-else statements, for loops, while loops, and the apply family of functions.\n\nBy the end you will be able to write clean, reusable R code and understand when to use loops versus vectorized operations.",
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 6
      }
    ],
    duration: "3.5 hours",
    exercises: 21,
    completed: false,
    codeExample: `# R Fundamentals Example

# Vectors
scores <- c(85, 92, 78, 95, 88)
names <- c("Alice", "Bob", "Carol", "David", "Eve")

# Basic statistics
mean_score <- mean(scores)
sd_score <- sd(scores)
cat("Mean:", mean_score, "SD:", sd_score, "\\n")

# Data frame
students <- data.frame(
  name = names,
  score = scores,
  passed = scores >= 80
)

print(students)

# Function
grade <- function(score) {
  if (score >= 90) "A"
  else if (score >= 80) "B"
  else if (score >= 70) "C"
  else "F"
}

students$grade <- sapply(students$score, grade)
print(students)`
  },
  {
    id: 2,
    title: "Data Manipulation with Tidyverse",
    description: "Master modern R data wrangling with dplyr, tidyr, and pipes.",
    topics: [
      {
        id: "r-dplyr",
        title: "Data Wrangling with dplyr",
        content:
          "dplyr is the most popular R package for data manipulation, providing a consistent set of verbs for common operations. In this topic you will learn the core dplyr functions: filter() for subsetting rows, select() for choosing columns, mutate() for creating new variables, arrange() for sorting, and summarize() for aggregations.\n\nYou will also master the pipe operator %>% for chaining operations into readable workflows. By the end you will be able to transform messy data into analysis-ready formats efficiently.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "r-tidyr",
        title: "Reshaping Data with tidyr",
        content:
          "Real-world data often comes in formats that aren't ideal for analysis. In this topic you will use tidyr to reshape data between wide and long formats using pivot_longer() and pivot_wider(). You will handle missing values, separate and unite columns, and nest data for grouped operations.\n\nBy the end you will understand the concept of tidy data and be able to transform any dataset into a tidy format suitable for analysis and visualization.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "r-joins",
        title: "Combining Datasets",
        content:
          "Data analysis often requires combining information from multiple sources. In this topic you will learn about different types of joins: inner, left, right, and full joins using dplyr. You will also explore set operations like union, intersect, and setdiff.\n\nYou will practice joining datasets on single and multiple keys, handling duplicate keys, and diagnosing join problems. By the end you will be able to merge complex datasets confidently.",
        duration: "45 min",
        difficulty: "Intermediate",
        exercises: 5
      },
      {
        id: "r-strings",
        title: "String Manipulation with stringr",
        content:
          "Text data requires special handling in data analysis. In this topic you will use the stringr package for consistent string manipulation. You will learn pattern matching with regular expressions, string extraction, replacement, and splitting.\n\nYou will also work with common text cleaning tasks like trimming whitespace, changing case, and parsing structured text. By the end you will be comfortable processing text data in R.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.4 hours",
    exercises: 24,
    completed: false,
    codeExample: `# Tidyverse Data Manipulation
library(dplyr)
library(tidyr)

# Sample data
sales <- data.frame(
  product = c("A", "B", "A", "B", "A"),
  region = c("East", "East", "West", "West", "East"),
  q1 = c(100, 150, 120, 180, 90),
  q2 = c(110, 160, 130, 190, 95)
)

# dplyr pipeline
summary_stats <- sales %>%
  pivot_longer(cols = c(q1, q2), 
               names_to = "quarter", 
               values_to = "revenue") %>%
  group_by(product, region) %>%
  summarize(
    total_revenue = sum(revenue),
    avg_revenue = mean(revenue),
    .groups = "drop"
  ) %>%
  arrange(desc(total_revenue))

print(summary_stats)

# Filter and mutate
top_performers <- sales %>%
  mutate(total = q1 + q2) %>%
  filter(total > 250) %>%
  select(product, region, total)

print(top_performers)`
  },
  {
    id: 3,
    title: "Data Visualization with ggplot2",
    description: "Create publication-quality graphics using the grammar of graphics.",
    topics: [
      {
        id: "r-ggplot-basics",
        title: "ggplot2 Fundamentals",
        content:
          "ggplot2 implements the grammar of graphics, a powerful framework for building visualizations layer by layer. In this topic you will understand the core components: data, aesthetics (aes), and geometries (geoms). You will create basic plots including scatter plots, line charts, and bar charts.\n\nYou will learn how to map variables to visual properties like position, color, size, and shape. By the end you will understand ggplot2's layered approach and be able to create informative visualizations.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "r-ggplot-customization",
        title: "Customizing Plots",
        content:
          "Default plots are a starting point; customization makes them publication-ready. In this topic you will modify scales, axes, and legends. You will apply themes for consistent styling and create your own custom themes. You will add titles, labels, and annotations to communicate your findings.\n\nBy the end you will be able to create polished, professional visualizations that effectively communicate data insights.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "r-ggplot-facets",
        title: "Faceting & Multiple Plots",
        content:
          "Sometimes one plot isn't enough to show patterns in your data. In this topic you will use facet_wrap() and facet_grid() to create small multiples that reveal patterns across groups. You will also combine multiple plots using packages like patchwork.\n\nYou will learn when faceting is more effective than color coding and how to create dashboard-style layouts. By the end you will be able to create complex multi-panel visualizations.",
        duration: "45 min",
        difficulty: "Intermediate",
        exercises: 5
      },
      {
        id: "r-ggplot-advanced",
        title: "Statistical Visualizations",
        content:
          "ggplot2 excels at statistical graphics that go beyond basic charts. In this topic you will create histograms, density plots, box plots, and violin plots for distribution analysis. You will add statistical summaries, confidence intervals, and regression lines to your plots.\n\nBy the end you will be able to create visualizations that not only show data but also reveal statistical relationships and uncertainty.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      }
    ],
    duration: "3.4 hours",
    exercises: 23,
    completed: false,
    codeExample: `# ggplot2 Visualization
library(ggplot2)

# Sample data
df <- data.frame(
  category = rep(c("A", "B", "C"), each = 50),
  value = c(rnorm(50, 10, 2), rnorm(50, 15, 3), rnorm(50, 12, 2.5)),
  group = rep(c("Control", "Treatment"), 75)
)

# Box plot with points
ggplot(df, aes(x = category, y = value, fill = group)) +
  geom_boxplot(alpha = 0.7) +
  geom_jitter(width = 0.2, alpha = 0.5) +
  labs(
    title = "Distribution by Category and Group",
    x = "Category",
    y = "Value",
    fill = "Group"
  ) +
  theme_minimal() +
  scale_fill_brewer(palette = "Set2")

# Faceted histogram
ggplot(df, aes(x = value, fill = group)) +
  geom_histogram(bins = 15, alpha = 0.7, position = "identity") +
  facet_wrap(~category, scales = "free_y") +
  theme_bw() +
  labs(title = "Value Distribution by Category")`
  },
  {
    id: 4,
    title: "Statistical Analysis in R",
    description: "Apply statistical methods for hypothesis testing and modeling.",
    topics: [
      {
        id: "r-descriptive",
        title: "Descriptive Statistics",
        content:
          "Before modeling, you need to understand your data. In this topic you will calculate measures of central tendency (mean, median, mode), dispersion (variance, standard deviation, IQR), and shape (skewness, kurtosis). You will create summary tables and identify outliers.\n\nYou will also explore correlation analysis and understand the difference between correlation and causation. By the end you will be able to thoroughly describe any dataset.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "r-hypothesis",
        title: "Hypothesis Testing",
        content:
          "Hypothesis testing helps you make decisions based on data. In this topic you will learn the framework of null and alternative hypotheses, p-values, and significance levels. You will perform t-tests for comparing means, chi-square tests for categorical data, and ANOVA for multiple groups.\n\nYou will understand Type I and Type II errors and how to interpret results correctly. By the end you will be able to choose and apply appropriate statistical tests.",
        duration: "60 min",
        difficulty: "Intermediate",
        exercises: 7
      },
      {
        id: "r-regression",
        title: "Linear Regression",
        content:
          "Regression models relationships between variables. In this topic you will fit simple and multiple linear regression models using lm(). You will interpret coefficients, assess model fit with R-squared, and check assumptions using diagnostic plots.\n\nYou will also learn about model selection, handling categorical predictors, and making predictions. By the end you will be able to build and evaluate regression models for real-world problems.",
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 7
      },
      {
        id: "r-reporting",
        title: "R Markdown & Reporting",
        content:
          "Reproducible research requires combining code, results, and narrative. In this topic you will create R Markdown documents that weave together R code, output, and formatted text. You will generate HTML, PDF, and Word reports from a single source.\n\nYou will learn about code chunks, inline R expressions, and creating tables and figures for reports. By the end you will be able to produce professional, reproducible analysis reports.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      }
    ],
    duration: "3.8 hours",
    exercises: 25,
    completed: false,
    codeExample: `# Statistical Analysis in R

# Sample data
set.seed(42)
control <- rnorm(30, mean = 100, sd = 15)
treatment <- rnorm(30, mean = 110, sd = 15)

# Descriptive statistics
cat("Control - Mean:", mean(control), "SD:", sd(control), "\\n")
cat("Treatment - Mean:", mean(treatment), "SD:", sd(treatment), "\\n")

# T-test
t_result <- t.test(treatment, control)
print(t_result)

# Linear regression
df <- data.frame(
  x = 1:50,
  y = 2 * (1:50) + rnorm(50, 0, 5)
)

model <- lm(y ~ x, data = df)
summary(model)

# Predictions
new_data <- data.frame(x = c(55, 60, 65))
predictions <- predict(model, new_data, interval = "confidence")
print(predictions)`
  }
];




