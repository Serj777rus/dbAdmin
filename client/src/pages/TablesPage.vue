<template>
  <div class="space-y-6">
    <div>
      <p class="text-sm uppercase text-slate-500">База {{ dbName }}</p>
      <h2 class="text-3xl font-semibold text-white">Таблицы и данные</h2>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 class="text-xl font-semibold text-white">Таблицы</h3>
      <div class="mt-4 grid gap-3 lg:grid-cols-2">
        <button
          v-for="table in databases.tables"
          :key="table.Name"
          class="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-left transition hover:border-brand"
          @click="openTable(table.Name)"
        >
          <p class="text-lg font-semibold text-white">{{ table.Name }}</p>
          <p class="text-sm text-slate-500">
            {{ table.Rows }} строк · {{ table.Engine }}
          </p>
        </button>
      </div>
      <div
        v-if="!databases.tables.length"
        class="mt-4 rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500"
      >
        Таблицы не найдены. Создайте новую через SQL-консоль.
      </div>
    </div>

    <div
      v-if="feedback"
      class="rounded-xl border px-4 py-3 text-sm"
      :class="
        feedbackType === 'error'
          ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
      "
    >
      {{ feedback }}
    </div>

    <div
      v-if="selectedTable"
      class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm uppercase text-slate-500">Таблица</p>
          <h3 class="text-2xl font-semibold text-white">{{ selectedTable }}</h3>
        </div>
        <button
          class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-brand"
          @click="loadTable"
        >
          Обновить
        </button>
      </div>
      <div class="mt-6 overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-800 text-sm">
          <thead class="bg-slate-950/40">
            <tr>
              <th
                v-for="column in databases.tableColumns"
                :key="column.Field"
                class="px-4 py-3 text-left font-medium text-slate-400"
              >
                {{ column.Field }}
              </th>
              <th class="px-4 py-3 text-right font-medium text-slate-400">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-900/60">
            <tr
              v-for="(row, idx) in databases.tableData"
              :key="idx"
              class="hover:bg-slate-900/40"
            >
              <td v-for="column in databases.tableColumns" :key="column.Field" class="px-4 py-2">
                {{ row[column.Field] }}
              </td>
              <td class="px-4 py-2">
                <div class="flex flex-wrap justify-end gap-2 text-xs">
                  <button
                    class="rounded-lg border border-slate-600 px-3 py-1 text-slate-200 hover:border-brand"
                    @click="startEdit(row)"
                  >
                    Изменить
                  </button>
                  <button
                    class="rounded-lg border border-rose-500/50 px-3 py-1 text-rose-300 hover:bg-rose-500/10"
                    @click="deleteRowItem(row)"
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!databases.tableData.length">
              <td :colspan="databases.tableColumns.length + 1" class="px-4 py-6 text-center text-sm text-slate-500">
                Нет данных. Добавьте первую запись.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
        <h4 class="text-xl font-semibold text-white">Добавить запись</h4>
        <p class="mb-4 text-sm text-slate-400">Новая строка будет создана в таблице {{ selectedTable }}.</p>
        <form class="grid gap-4 md:grid-cols-2" @submit.prevent="createRow">
          <div v-for="column in databases.tableColumns" :key="column.Field" class="flex flex-col gap-1">
            <label class="text-xs tracking-wide text-slate-400">{{ column.Field }}</label>
            <input
              v-model="newRow[column.Field]"
              class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand outline-none"
              :placeholder="column.Type || 'значение'"
            />
          </div>
          <div class="md:col-span-2">
            <button
              class="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark"
            >
              Сохранить запись
            </button>
          </div>
        </form>
      </div>

      <div
        v-if="editingRow"
        class="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 class="text-xl font-semibold text-white">Редактирование записи</h4>
            <p class="text-sm text-slate-400">
              Выбрано значение {{ editKeyColumn }} = {{ editKeyValue || '—' }}
            </p>
          </div>
          <button
            class="rounded-lg border border-slate-600 px-3 py-1 text-sm text-slate-300 hover:border-brand"
            @click="cancelEdit"
          >
            Отмена
          </button>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-1">
            <label class="text-xs tracking-wide text-slate-400">Ключевой столбец</label>
            <select
              v-model="editKeyColumn"
              class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand"
            >
              <option v-for="column in databases.tableColumns" :key="column.Field" :value="column.Field">
                {{ column.Field }}
              </option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs tracking-wide text-slate-400">Значение ключа</label>
            <input
              v-model="editKeyValue"
              class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand"
            />
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div v-for="column in databases.tableColumns" :key="column.Field" class="flex flex-col gap-1">
            <label class="text-xs tracking-wide text-slate-400">{{ column.Field }}</label>
            <input
              v-model="editRowData[column.Field]"
              class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand"
            />
          </div>
        </div>
        <button
          class="w-full rounded-lg border border-emerald-500/50 px-4 py-2 font-semibold text-emerald-200 hover:bg-emerald-500/10"
          @click="applyEdit"
        >
          Обновить запись
        </button>
      </div>
    </div>

    <div
      v-else
      class="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400"
    >
      Выберите таблицу, чтобы просмотреть данные и управлять записями.
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDatabasesStore } from '../store/databases.js';
import api from '../services/api.js';

const route = useRoute();

const databases = useDatabasesStore();
const selectedTable = ref('');
const newRow = reactive({});
const editRowData = reactive({});
const editingRow = ref(null);
const editKeyColumn = ref('');
const editKeyValue = ref('');
const feedback = ref('');
const feedbackType = ref('success');

const connectionId = computed(() => Number(route.params.connectionId));
const dbName = computed(() => route.params.dbName?.toString() || '');
const defaultKeyColumn = computed(() => databases.tableColumns[0]?.Field || '');

const getConnectionId = () => connectionId.value;
const getDbName = () => dbName.value;

const loadTables = () => databases.fetchTables(getConnectionId(), getDbName());
const loadTable = () => {
  if (!selectedTable.value) return;
  databases.fetchTableData(getConnectionId(), getDbName(), selectedTable.value);
};

const openTable = (tableName) => {
  selectedTable.value = tableName;
  loadTable();
};

const handleRouteChange = () => {
  selectedTable.value = '';
  loadTables();
};

onMounted(loadTables);

watch(
  () => [route.params.connectionId, route.params.dbName],
  handleRouteChange
);

watch(
  () => databases.tableColumns.map((col) => col.Field).join(','),
  () => {
    Object.keys(newRow).forEach((key) => delete newRow[key]);
    Object.keys(editRowData).forEach((key) => delete editRowData[key]);
    databases.tableColumns.forEach((column) => {
      newRow[column.Field] = '';
      editRowData[column.Field] = '';
    });
    if (!editKeyColumn.value) {
      editKeyColumn.value = defaultKeyColumn.value;
    }
  },
  { immediate: true }
);

watch(
  () => editKeyColumn.value,
  (column) => {
    if (editingRow.value && column) {
      editKeyValue.value = editingRow.value[column] ?? '';
    }
  }
);

const setFeedback = (message, type = 'success') => {
  feedback.value = message;
  feedbackType.value = type;
  if (message) {
    setTimeout(() => {
      feedback.value = '';
    }, 4000);
  }
};

const resetNewRow = () => {
  Object.keys(newRow).forEach((key) => {
    newRow[key] = '';
  });
};

const ensureTableSelected = () => {
  if (!selectedTable.value) {
    setFeedback('Сначала выберите таблицу', 'error');
    return false;
  }
  return true;
};

const createRow = async () => {
  if (!ensureTableSelected()) return;
  try {
    const payload = JSON.parse(JSON.stringify(newRow));
    await api.post(
      `/db/${getConnectionId()}/databases/${getDbName()}/tables/${selectedTable.value}/data`,
      { data: payload }
    );
    setFeedback('Запись успешно добавлена');
    resetNewRow();
    loadTable();
  } catch (error) {
    setFeedback(error.response?.data?.message || 'Не удалось добавить запись', 'error');
  }
};

const startEdit = (row) => {
  editingRow.value = row;
  Object.keys(editRowData).forEach((key) => {
    editRowData[key] = row[key] ?? '';
  });
  editKeyColumn.value = editKeyColumn.value || defaultKeyColumn.value;
  editKeyValue.value = row[editKeyColumn.value] ?? '';
};

const cancelEdit = () => {
  editingRow.value = null;
};

const applyEdit = async () => {
  if (!ensureTableSelected() || !editKeyColumn.value) return;
  try {
    await api.put(
      `/db/${getConnectionId()}/databases/${getDbName()}/tables/${selectedTable.value}/data`,
      {
        keyColumn: editKeyColumn.value,
        keyValue: editKeyValue.value,
        data: JSON.parse(JSON.stringify(editRowData))
      }
    );
    setFeedback('Запись обновлена');
    editingRow.value = null;
    loadTable();
  } catch (error) {
    setFeedback(error.response?.data?.message || 'Не удалось обновить запись', 'error');
  }
};

const deleteRowItem = async (row) => {
  if (!ensureTableSelected()) return;
  const keyColumn = defaultKeyColumn.value;
  if (!keyColumn) {
    setFeedback('Не удалось определить ключевой столбец', 'error');
    return;
  }
  const keyValue = row[keyColumn];
  try {
    await api.delete(
      `/db/${getConnectionId()}/databases/${getDbName()}/tables/${selectedTable.value}/data`,
      {
        data: {
          keyColumn,
          keyValue
        }
      }
    );
    setFeedback('Запись удалена');
    if (editingRow.value === row) {
      editingRow.value = null;
    }
    loadTable();
  } catch (error) {
    setFeedback(error.response?.data?.message || 'Не удалось удалить запись', 'error');
  }
};
</script>

