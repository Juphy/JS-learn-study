# coding: utf-8

import pandas as pd

df = pd.read_excel('trade.xlsx')
print(df)

df_grp = df.groupby(['证券代码', '买卖方向']).sum()
print(df_grp)
pd.ExcelWriter(df_grp)
tmp_df = df.copy()
tmp_df.index = [df['证券代码'], df['买卖方向']]
tmp_df.drop_duplicates(['证券代码', '买卖方向'], inplace=True)

other_cols = list(set(tmp_df.columns) - set(df_grp.columns))
df_sum = pd.concat([df_grp, tmp_df.loc[:, other_cols]], axis=1)
print(df_sum)
