## сводный таблица Introduction

сводный таблица, also known as multidimensional analysis таблица, cross таблица, сводный таблица, refers к a таблица that can put one или more Dimensions в row Dimensions и column Dimensions к display the relationship between Dimensions. Users can analyze various scenarios в a glance Metirc и comparison, designed к help business analysis drive decision-making.

## Applicable scenarios для сводный таблицаs

сводный таблицаs are suiтаблица для various данные analytics scenarios, providing users с powerful данные exploration и analysis capabilities. Следующий are common applicable scenarios для сводный таблицаs:

*   **данные aggregation и overview**: сводный таблицаs can be used к summarize и overview large amounts из данные. Through the aggregation функция из сводный таблицаs, users can quickly calculate statistical Metirc such as total, averвозраст, и total из данные в order к obtain the overall situation из the данные.

*   **MultiDimension Analysis**: сводный таблицаs excel в multi-Dimension данные analytics. Users can explore the relationship и trend из данные under different Dimensions по selecting different полеs as rows, columns и values в the сводный таблица к gain insight into the details из the данные.

*   **данные Comparison и Trend Analysis**: сводный таблицаs включить users к quickly compare differences и trends between different данные. по placing данные в rows и columns из the сводный таблица, users can easily compare данные under different categories, time periods или other Dimensions, и visualize graphs к present trends в данные changes.

*   **Outliers и Outlier Analysis**: сводный таблицаs are also very useful для finding anomalies и outliers. Through the filtering и filtering функция из сводный таблицаs, users can filter данные according к specific conditions и quickly identify outliers или abnormal patterns, so as к deeply analyze anomalies в the данные.

*   **Business Decision Support**: сводный таблицаs provide strong support для business decision-making. Through flexible operation и пользовательскийized analysis из данные, users can deeply understand business данные от different perspectives и Dimensions, grasp key business Metirc и trends, и provide accurate данные support для decision-making.

в conclusion, сводный таблицаs have a wide range из application значение в various данные analytics scenarios. Whether it is данные summarization и overview, multi-Dimension analysis, данные comparison и trend analysis, outlier analysis или support для business decision-making, сводный таблицаs can help users dig deep into данные insights и provide powerful данные analytics tools.

## Advantвозрастs из Vтаблица сводный таблицаs

Vтаблица сводный таблицаs have Следующий advantвозрастs в данные analytics:

*   **MultiDimension Analysis**: сводный таблицаs support multi-Dimension analysis, enabling users к compare и analyze данные от multiple Dimensions simultaneously в one таблица.

*   **High Производительность rendering**: When displaying massive amounts из данные, the сводный таблица can still respond quickly к user actions и avoid browser cards и crashes.

*   **visual form**: сводный таблицаs provide visual данные display методы, such as histograms, line графикs, etc., so that users can understand и compare данные more intuitively.

*   **Tree-like visual данные display**: по presenting Dimension и Metirc в a tree structure, users can more intuitively grasp the hierarchical и comparative relationships between данные.

*   **Flexible макет**: сводный таблицаs are flexible и dynamic, и users can adjust the arrangement из rows, columns и values as needed.

*   **пользовательский style**: Вы можете give или define different display styles respectively к dimension или indicator.

## сводный таблица базовый Concepts

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/4f62a673241122408f7245401.png)

### Dimensions

Dimension (Dimension): The perspective used к classify данные и people observe business situations; для пример: country, province, Категория, product имя.

### Dimension hierarchy

Dimension Level: According к the different levels из Dimension details, a class из attributes is divided into different levels predefined по Dimension. для пример, the level из date Dimension includes year, month, и day; the Регионal level includes: country, Регион, province, и Город.

### Dimension members

Dimension member (Dimension значение): It is the значение из the данные items на каждый Dimension. для пример, the Dimension members из the level month из the date Dimension are: January, February, March, etc., и the members из the Регион are: Northeast China, North China, и середина China;

### Metirc

Metirc (Indicator): данные used к describe business conditions, such as measures such as Продажи, costs, Прибыльs, etc.

### row header tree

Row Tree: A таблица header that represents the hierarchical relationship из row Dimensions в a tree-like structure.

### список header tree

Column Tree: A таблица header that represents the column Dimension hierarchy в a tree structure.

### corner

Corner: The cell в the intersection из the row header и список header Регион, used к display Metirc headers и other auxiliary information.

## Concept mapping к configuration items

We will take the configuration из the сводный таблица в Следующий figure as an пример. There are two rows и columns для Dimension и two для Metirc.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c60c.jpeg)

    {
        rows: [
          {
            dimensionKey: '类别',
            заголовок: '类别',
          },
          {
            dimensionKey: '子类别',
            заголовок: '子类别',
          }
        ],
        columns: 
        [
          {
            dimensionKey: '地区',
            заголовок: '地区',
            headerFormat(значение) {
              возврат `${значение}地区`;
            },
          },
          {
            dimensionKey: '邮寄方式',
            заголовок: '邮寄方式',
            headerFormat(значение) {
              возврат `${значение}邮寄方式`;
            },
          }
        ],
      indicators: [
          {
            indicatorKey: '1',
            заголовок: '销售额',
          },
          {
            indicatorKey: '2',
            заголовок: '利润',
          }
        ],
    }


в the above configuration, rows и columns define the **dimension** базовый information corresponding к the row header и column header, including title, headerStyle, format, etc.

indicators define the базовый information из indicators, including title, style, format, etc.