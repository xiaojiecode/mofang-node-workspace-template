/** 通过用户可见的年月、日期网格和时间选项填写浮层草稿，由测试调用方决定确认或取消。 */
export async function chooseCalendarDraft(scope, label, value) {
    const [date, time] = value.split('T')
    const [year, month, day] = date.split('-').map(Number)
    await scope.getByRole('combobox', { name: label, exact: true }).click()
    const dialog = scope.getByRole('dialog', { name: '选择' + label, exact: true })
    await dialog.waitFor()
    await dialog.getByRole('spinbutton', { name: '年份', exact: true }).fill(String(year))
    await dialog.getByRole('combobox', { name: '月份', exact: true }).click()
    await dialog.getByRole('option', { name: month + '月', exact: true }).click()
    await dialog.getByRole('button', { name: `${year}年${month}月${day}日`, exact: true }).click()
    if (time) {
        const [hour, minute] = time.split(':')
        for (const [name, selected] of [
            ['小时', hour],
            ['分钟', minute],
        ]) {
            await dialog.getByRole('combobox', { name, exact: true }).click()
            await dialog.getByRole('option', { name: selected, exact: true }).click()
        }
    }
    return dialog
}
