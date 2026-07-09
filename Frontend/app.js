const API_BASE_URL = 'http://localhost:8080';
var currentProblemId = null;
let monacoEditor = null;
let monacoLoadStarted = false;
let completionProvidersRegistered = false;
let activePollInterval = null;
let pollTimeout = null;

const languageMap = { 'python': 'python', 'java': 'java', 'cpp': 'cpp' };
const fileNameMap = { 'python': 'solution.py', 'java': 'Main.java', 'cpp': 'solution.cpp' };

const starterCode = {
    python: '# Write your solution here\n\n',
    java: 'class Main {\n    public static void main(String[] args) {\n        \n    }\n}\n',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n'
};

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }});

function initMonaco(onReady) {
    const container = document.getElementById('monacoEditorContainer');
    if (!container) return;

    if (!window.monaco) {
        if (!monacoLoadStarted) {
            monacoLoadStarted = true;
            require(['vs/editor/editor.main'], function () { initMonaco(onReady); });
        } else {
            // another load is already in flight — poll until it's ready
            setTimeout(function () { initMonaco(onReady); }, 50);
        }
        return;
    }

    if (monacoEditor) {
        monacoEditor.dispose();
        monacoEditor = null;
    }

    registerCompletionProviders();

    monacoEditor = monaco.editor.create(container, {
        value: starterCode.python,
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        fontLigatures: true,
        padding: { top: 12 },
        scrollBeyondLastLine: false,
        quickSuggestions: { other: true, comments: false, strings: true },
        suggestOnTriggerCharacters: true,
        wordBasedSuggestions: 'currentDocument',
        snippetSuggestions: 'inline',
        tabCompletion: 'on',
        parameterHints: { enabled: true },
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoIndent: 'full',
        matchBrackets: 'always',
        bracketPairColorization: { enabled: true },
        renderLineHighlight: 'all',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        formatOnType: true,
        formatOnPaste: true,
        folding: true,
        roundedSelection: true,
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 }
    });

    setTimeout(function () { if (monacoEditor) monacoEditor.layout(); }, 100);

    if (typeof onReady === 'function') onReady();
}

function registerCompletionProviders() {
    if (completionProvidersRegistered || !window.monaco) return;
    completionProvidersRegistered = true;

    const S = monaco.languages.CompletionItemKind.Snippet;
    const R = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;

    monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: function () {
            return {
                suggestions: [
                    { label: 'def', kind: S, insertText: 'def ${1:function_name}(${2:params}):\n    ${3:pass}', insertTextRules: R, documentation: 'Function definition' },
                    { label: 'class', kind: S, insertText: 'class ${1:ClassName}:\n    def __init__(self${2:, args}):\n        ${3:pass}', insertTextRules: R, documentation: 'Class definition' },
                    { label: 'for', kind: S, insertText: 'for ${1:i} in range(${2:n}):\n    ${3:pass}', insertTextRules: R, documentation: 'For loop' },
                    { label: 'if', kind: S, insertText: 'if ${1:condition}:\n    ${2:pass}', insertTextRules: R, documentation: 'If statement' },
                    { label: 'main', kind: S, insertText: 'def solve():\n    ${1:pass}\n\nif __name__ == "__main__":\n    solve()', insertTextRules: R, documentation: 'Main entrypoint' },
                    { label: 'print', kind: S, insertText: 'print(${1:value})', insertTextRules: R, documentation: 'Print statement' },
                    { label: 'if_else', kind: S, insertText: 'if ${1:condition}:\n    ${2:pass}\nelse:\n    ${3:pass}', insertTextRules: R, documentation: 'If-else' },
                    { label: 'while', kind: S, insertText: 'while ${1:condition}:\n    ${2:pass}', insertTextRules: R, documentation: 'While loop' },
                ]
            };
        }
    });

    monaco.languages.registerCompletionItemProvider('java', {
        provideCompletionItems: function () {
            return {
                suggestions: [
                    { label: 'psvm', kind: S, insertText: 'public static void main(String[] args) {\n    ${1}\n}', insertTextRules: R, documentation: 'main method' },
                    { label: 'sout', kind: S, insertText: 'System.out.println(${1});', insertTextRules: R, documentation: 'Print line' },
                    { label: 'for', kind: S, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${3}\n}', insertTextRules: R, documentation: 'For loop' },
                    { label: 'if', kind: S, insertText: 'if (${1:condition}) {\n    ${2}\n}', insertTextRules: R, documentation: 'If statement' },
                    { label: 'class', kind: S, insertText: 'class ${1:Solution} {\n    ${2}\n}', insertTextRules: R, documentation: 'Class definition' },
                    { label: 'if_else', kind: S, insertText: 'if (${1:condition}) {\n    ${2}\n} else {\n    ${3}\n}', insertTextRules: R, documentation: 'If-else' },
                    { label: 'while', kind: S, insertText: 'while (${1:condition}) {\n    ${2}\n}', insertTextRules: R, documentation: 'While loop' },
                ]
            };
        }
    });

    monaco.languages.registerCompletionItemProvider('cpp', {
        provideCompletionItems: function () {
            return {
                suggestions: [
                    { label: 'main', kind: S, insertText: 'int main() {\n    ${1}\n    return 0;\n}', insertTextRules: R, documentation: 'main function' },
                    { label: 'cout', kind: S, insertText: 'cout << ${1} << endl;', insertTextRules: R, documentation: 'Print to stdout' },
                    { label: 'for', kind: S, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${3}\n}', insertTextRules: R, documentation: 'For loop' },
                    { label: 'if', kind: S, insertText: 'if (${1:condition}) {\n    ${2}\n}', insertTextRules: R, documentation: 'If statement' },
                    { label: 'vector', kind: S, insertText: 'vector<${1:int}> ${2:v};', insertTextRules: R, documentation: 'Vector declaration' },
                    { label: 'if_else', kind: S, insertText: 'if (${1:condition}) {\n    ${2}\n} else {\n    ${3}\n}', insertTextRules: R, documentation: 'If-else' },
                    { label: 'while', kind: S, insertText: 'while (${1:condition}) {\n    ${2}\n}', insertTextRules: R, documentation: 'While loop' },
                ]
            };
        }
    });
}

function resetCode() {
    if (!monacoEditor) return;
    if (!confirm('Reset your code back to the starter template?')) return;
    const lang = document.getElementById('solveLanguageSelect').value;
    delete codeDrafts[lang];
    monacoEditor.setValue(starterCode[lang] || '');
}

// --- VIEW ROUTING ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(function(v) { v.classList.add('hidden'); });
    clearAuthForms();

    if (viewId.startsWith('solve/')) {
        const problemId = viewId.split('/')[1];
        document.getElementById('view-solve').classList.remove('hidden');

        if (!monacoEditor) {
            initMonaco(function () { loadSolveView(problemId); });
        } else {
            monacoEditor.layout();
            loadSolveView(problemId);
        }
    } else {
        stopPolling();
        resetEditor();
        const target = document.getElementById('view-' + viewId);
        if (target) {
            target.classList.remove('hidden');
        } else {
            document.getElementById('view-home').classList.remove('hidden');
        }
    }
    closeAuthDropdown();
    if (viewId === 'problems') loadProblems();
    if (viewId === 'admin') { loadAdminProblems(); }
    if (viewId === 'history') renderHistory();
}

function clearAuthForms() {
    ['loginUsername', 'loginPassword', 'regUsername', 'regEmail', 'regPassword',
        'adminLoginUsername', 'adminLoginPassword'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

async function loadSolveView(id) {
    currentProblemId = id;
    stopPolling();
    hideSubmissionResult();
    try {
        const res = await fetch(API_BASE_URL + '/problems/' + id);
        if (!res.ok) throw new Error('Problem not found');
        const problem = await res.json();
        document.getElementById('solveTitle').textContent = problem.title;
        document.getElementById('solveDesc').textContent = problem.description || '';
        document.getElementById('solveConstraints').textContent = problem.constraints || '';
        document.getElementById('solveSampleInput').textContent = problem.sampleInput || '';
        document.getElementById('solveSampleOutput').textContent = problem.sampleOutput || '';

        const langSelect = document.getElementById('solveLanguageSelect');
        langSelect.value = 'python';
        langSelect.dataset.lastLang = 'python';
        document.getElementById('editorFileLabel').textContent = fileNameMap.python;

        codeDrafts = {}; // reset drafts for the new problem

        if (monacoEditor) {
            monacoEditor.setValue(starterCode.python);
            if (window.monaco) monaco.editor.setModelLanguage(monacoEditor.getModel(), 'python');
            monacoEditor.focus();
        }
    } catch (e) {
        console.error(e);
        alert('Could not load problem. Please try again.');
    }
}

function hideSubmissionResult() {
    const result = document.getElementById('solveSubmissionResult');
    result.classList.add('hidden');
    document.getElementById('verdictLoading').classList.add('hidden');
    const verdictDisplay = document.getElementById('verdictDisplay');
    verdictDisplay.classList.add('hidden');
    verdictDisplay.innerHTML = '';
    const btn = document.getElementById('submitCodeBtn');
    if (btn) btn.disabled = false;
}

function resetEditor() {
    stopPolling();
    if (monacoEditor) {
        monacoEditor.dispose();
        monacoEditor = null;
    }
    currentProblemId = null;
    const langSelect = document.getElementById('solveLanguageSelect');
    if (langSelect) langSelect.value = 'python';
    hideSubmissionResult();
}

let codeDrafts = {};

function changeEditorLanguage(lang) {
    const fileLabel = document.getElementById('editorFileLabel');
    if (fileLabel) fileLabel.textContent = fileNameMap[lang] || 'solution.txt';

    if (monacoEditor && window.monaco) {
        const langSelect = document.getElementById('solveLanguageSelect');
        const prevLang = langSelect ? langSelect.dataset.lastLang : null;

        // save whatever was in the editor for the language we're leaving
        if (prevLang) {
            codeDrafts[prevLang] = monacoEditor.getValue();
        }

        const model = monacoEditor.getModel();
        if (model) {
            monaco.editor.setModelLanguage(model, languageMap[lang] || 'plaintext');
        }

        // restore this language's draft, or fall back to its starter template
        monacoEditor.setValue(
            codeDrafts.hasOwnProperty(lang) ? codeDrafts[lang] : (starterCode[lang] || '')
        );

        if (langSelect) langSelect.dataset.lastLang = lang;
    }
}

function checkAuthAndRoute() {
    const hash = window.location.hash.substring(1) || 'home';
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    // Require login for protected views
    if ((hash === 'problems' || hash.startsWith('solve/') || hash === 'admin' || hash === 'history') && !username) {
        alert('Please login to access this page.');
        window.location.hash = 'login';
        return;
    }

    // Admin only
    if (hash === 'admin' && role !== 'ADMIN') {
        alert('Access Denied: Admins only!');
        window.location.hash = 'problems';
        return;
    }

    // Block admins from viewing history
    if (hash === 'history' && role === 'ADMIN') {
        alert('History is not available for admin accounts.');
        window.location.hash = 'admin';
        return;
    }

    showView(hash);
    updateNavbar();
}

function updateNavbar() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const authLinks = document.getElementById('authLinks');
    const userLinks = document.getElementById('userLinks');
    const welcomeMsg = document.getElementById('welcomeMsg');
    const dynamicNavLinks = document.getElementById('dynamicNavLinks');

    dynamicNavLinks.innerHTML = '';

    if (username) {
        authLinks.classList.add('hidden');
        userLinks.classList.remove('hidden');
        userLinks.classList.add('flex');
        welcomeMsg.textContent = 'Welcome, ' + username + (role === 'ADMIN' ? ' (Admin)' : '');

        // Always show Problems link
        dynamicNavLinks.innerHTML += '<a href="#problems" class="hover:text-blue-300 transition font-medium">Problems</a>';

        // Only show History link for non‑admin users
        if (role !== 'ADMIN') {
            dynamicNavLinks.innerHTML += '<a href="#history" class="hover:text-blue-300 transition font-medium">History</a>';
        }

        if (role === 'ADMIN') {
            dynamicNavLinks.innerHTML += '<a href="#admin" class="hover:text-yellow-300 transition font-medium text-yellow-400">Admin Panel</a>';
        }
    } else {
        authLinks.classList.remove('hidden');
        userLinks.classList.add('hidden');
        userLinks.classList.remove('flex');
    }
}

function handleStartSolving() {
    if (localStorage.getItem('username')) {
        window.location.hash = 'problems';
    } else {
        window.location.hash = 'login';
    }
}

function toggleAuthDropdown() { document.getElementById('authDropdown').classList.toggle('hidden'); }
function closeAuthDropdown() { document.getElementById('authDropdown').classList.add('hidden'); }

document.addEventListener('click', function(event) {
    if (!event.target.closest('#authLinks')) closeAuthDropdown();
});

window.addEventListener('load', checkAuthAndRoute);
window.addEventListener('hashchange', checkAuthAndRoute);

function logout() {
    localStorage.clear();
    stopPolling();
    resetEditor();
    clearAuthForms();
    window.location.hash = 'home';
    updateNavbar();
}

// --- AUTH API CALLS ---
async function loginUser() {
    try {
        const res = await fetch(API_BASE_URL + '/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('loginUsername').value,
                password: document.getElementById('loginPassword').value
            })
        });
        const data = await res.json();
        if (data.success) {
            if (data.role === 'ADMIN') {
                alert('This is an admin account. Please use the Admin Login page.');
                clearAuthForms();
                return;
            }
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            clearAuthForms();
            window.location.hash = 'problems';
        } else {
            alert('Login failed: ' + data.message);
            clearAuthForms();
        }
    } catch (e) {
        alert('Server error. Is backend running?');
    }
}

async function loginAdmin() {
    try {
        const res = await fetch(API_BASE_URL + '/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('adminLoginUsername').value,
                password: document.getElementById('adminLoginPassword').value
            })
        });
        const data = await res.json();
        if (data.success && data.role === 'ADMIN') {
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            clearAuthForms();
            window.location.hash = 'admin';
        } else if (data.success) {
            alert('Access Denied: this account is not an admin.');
            clearAuthForms();
        } else {
            alert('Login failed: ' + data.message);
            clearAuthForms();
        }
    } catch (e) {
        alert('Server error. Is backend running?');
    }
}

async function registerUser() {
    try {
        const res = await fetch(API_BASE_URL + '/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('regUsername').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value
            })
        });
        const data = await res.json();
        if (data.success) {
            alert('Registration successful! Please login.');
            clearAuthForms();
            window.location.hash = 'login';
        } else {
            alert('Registration failed: ' + data.message);
        }
    } catch (e) {
        alert('Server error. Is backend running?');
    }
}
function getSolvedProblemIds() {
    const username = localStorage.getItem('username');
    if (!username) return new Set();
    const historyKey = 'codejudge_history_' + username;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const solved = new Set();
    for (const entry of history) {
        if (entry.verdict === 'ACCEPTED') {
            solved.add(String(entry.problemId));
        }
    }
    return solved;
}
async function loadProblems() {
    const tbody = document.getElementById('problemsTableBody');
    tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-400"><div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-400 border-t-transparent"></div></td></tr>';
    try {
        const res = await fetch(API_BASE_URL + '/problems');
        const problems = await res.json();
        if (problems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-400">No problems yet.</td></tr>';
            return;
        }
        const solvedIds = getSolvedProblemIds();
        let html = '';
        for (const p of problems) {
            const colorClass = p.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                (p.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300');
            const isSolved = solvedIds.has(String(p.id));
            const actionCell = isSolved
                ? `<span class="inline-flex items-center gap-1.5 text-[var(--cj-accent)] font-mono text-sm font-semibold">✓ solved</span>`
                : `<span class="text-blue-400 font-semibold text-sm">Solve</span>`;
            html += `<tr class="hover:bg-dark-700 transition cursor-pointer" onclick="window.location.hash='solve/${p.id}'">`;
            html += `<td class="p-4 font-medium text-white">${p.title}</td>`;
            html += `<td class="p-4"><span class="px-3 py-1 rounded-full text-xs font-semibold ${colorClass}">${p.difficulty}</span></td>`;
            html += `<td class="p-4">${actionCell}</td>`;
            html += `</tr>`;
        }
        tbody.innerHTML = html;
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-red-400">Failed to load problems.</td></tr>';
    }
}
// --- ADMIN: Manage Problems (Load, Edit, Delete) ---
async function loadAdminProblems() {
    const tbody = document.getElementById('adminProblemsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">Loading…</td></tr>';
    try {
        const res = await fetch(API_BASE_URL + '/problems');
        const problems = await res.json();
        if (!problems.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">No problems found.</td></tr>';
            return;
        }
        let html = '';
        for (const p of problems) {
            html += `<tr class="border-b border-dark-700">`;
            html += `<td class="p-3 text-gray-400">${p.id}</td>`;
            html += `<td class="p-3 text-white">${p.title}</td>`;
            html += `<td class="p-3"><span class="px-2 py-1 rounded-full text-xs font-semibold ${p.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : p.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}">${p.difficulty}</span></td>`;
            html += `<td class="p-3 text-center space-x-2">`;
            html += `<button onclick="editProblem(${p.id})" class="text-blue-400 hover:text-blue-300 text-sm font-medium transition">Edit</button>`;
            html += `<button onclick="deleteProblem(${p.id})" class="text-red-400 hover:text-red-300 text-sm font-medium transition">Delete</button>`;
            html += `</td>`;
            html += `</tr>`;
        }
        tbody.innerHTML = html;
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-400">Failed to load.</td></tr>';
    }
}

// Edit: pre-fill the form
async function editProblem(id) {
    try {
        const res = await fetch(API_BASE_URL + '/problems/' + id);
        if (!res.ok) throw new Error('Problem not found');
        const p = await res.json();

        document.getElementById('probTitle').value = p.title;
        document.getElementById('probDesc').value = p.description || '';
        document.getElementById('probDiff').value = p.difficulty || 'Easy';
        document.getElementById('probConst').value = p.constraints || '';
        document.getElementById('probIn').value = p.sampleInput || '';
        document.getElementById('probOut').value = p.sampleOutput || '';

        // Change form mode
        document.getElementById('adminFormTitle').textContent = 'Edit Problem #' + id;
        const submitBtn = document.getElementById('adminSubmitBtn');
        submitBtn.textContent = 'Update Problem';
        submitBtn.dataset.editId = id;
        document.getElementById('adminCancelBtn').classList.remove('hidden');
    } catch (e) {
        alert('Could not load problem: ' + e.message);
    }
}

// Cancel edit
function cancelEditProblem() {
    document.getElementById('adminProblemForm').reset();
    document.getElementById('adminFormTitle').textContent = 'Create Problem';
    const submitBtn = document.getElementById('adminSubmitBtn');
    submitBtn.textContent = 'Create Problem';
    delete submitBtn.dataset.editId;
    document.getElementById('adminCancelBtn').classList.add('hidden');
}

// Handle create or update
async function handleProblemSubmit() {
    const submitBtn = document.getElementById('adminSubmitBtn');
    const editId = submitBtn.dataset.editId;

    const payload = {
        title: document.getElementById('probTitle').value,
        description: document.getElementById('probDesc').value,
        difficulty: document.getElementById('probDiff').value,
        constraints: document.getElementById('probConst').value,
        sampleInput: document.getElementById('probIn').value,
        sampleOutput: document.getElementById('probOut').value,
        testCases: [] // keep empty; test cases are managed separately
    };

    try {
        let url = API_BASE_URL + '/problems';
        let method = 'POST';
        if (editId) {
            url += '/' + editId;
            method = 'PUT';
        }
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert(editId ? 'Problem updated successfully!' : 'Problem created successfully!');
            cancelEditProblem();
            loadAdminProblems(); // refresh both tables
            loadProblems();
        } else {
            alert('Failed to save problem.');
        }
    } catch (e) {
        alert('Server error: ' + e.message);
    }
}

// Delete problem
async function deleteProblem(id) {
    if (!confirm('Delete problem #' + id + ' permanently?')) return;
    try {
        const res = await fetch(API_BASE_URL + '/problems/' + id, {
            method: 'DELETE'
        });
        if (res.ok) {
            alert('Problem deleted.');
            loadAdminProblems();
            loadProblems();
        } else {
            alert('Failed to delete problem.');
        }
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

// --- CREATE TEST CASE (unchanged) ---
async function createTestCase() {
    const pid = document.getElementById('tcProbId').value;
    if (!pid) { alert('Enter a valid Problem ID.'); return; }
    try {
        const probRes = await fetch(API_BASE_URL + '/problems/' + pid);
        if (!probRes.ok) throw new Error('Problem not found');
        const problem = await probRes.json();
        if (!problem.testCases) problem.testCases = [];
        problem.testCases.push({
            input: document.getElementById('tcInput').value,
            expectedOutput: document.getElementById('tcOutput').value,
            hidden: document.getElementById('tcHidden').checked
        });
        const updateRes = await fetch(API_BASE_URL + '/problems/' + pid, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(problem)
        });
        if (updateRes.ok) {
            alert('Test Case added successfully!');
            document.querySelector('#view-admin form:last-of-type').reset();
        } else {
            alert('Failed to add test case.');
        }
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

// --- ADMIN CLEANUP (unchanged) ---
async function resetProblems() {
    if (!confirm('Are you sure? This will delete ALL problems and test cases.')) return;
    const role = localStorage.getItem('role');
    try {
        const res = await fetch(API_BASE_URL + '/admin/problems', {
            method: 'DELETE',
            headers: { 'X-User-Role': role }
        });
        if (res.status === 403) { alert('Access Denied!'); return; }
        alert(await res.text());
        loadProblems();
        loadAdminProblems();
    } catch (e) { alert('Error: ' + e.message); }
}

async function resetSubmissions() {
    if (!confirm('Are you sure? This will delete ALL user submissions.')) return;
    const role = localStorage.getItem('role');
    try {
        const res = await fetch(API_BASE_URL + '/admin/submissions', {
            method: 'DELETE',
            headers: { 'X-User-Role': role }
        });
        if (res.status === 403) { alert('Access Denied!'); return; }
        alert(await res.text());
    } catch (e) { alert('Error: ' + e.message); }
}

async function fullReset() {
    if (!confirm('CRITICAL: This will wipe ALL problems, test cases, and submissions. Continue?')) return;
    if (!confirm('Last chance! Are you absolutely sure?')) return;
    const role = localStorage.getItem('role');
    try {
        const res = await fetch(API_BASE_URL + '/admin/reset-all', {
            method: 'DELETE',
            headers: { 'X-User-Role': role }
        });
        if (res.status === 403) { alert('Access Denied!'); return; }
        alert(await res.text());
        loadProblems();
        loadAdminProblems();
    } catch (e) { alert('Error: ' + e.message); }
}

// --- SUBMISSION FLOW (updated to show verdict & track history) ---
function submitCode() {
    const code = monacoEditor ? monacoEditor.getValue() : '';
    const lang = document.getElementById('solveLanguageSelect').value;

    if (!code.trim()) {
        alert('Please write some code before submitting!');
        return;
    }

    stopPolling();
    hideSubmissionResult();

    // Show loading
    const resultPanel = document.getElementById('solveSubmissionResult');
    resultPanel.classList.remove('hidden');
    document.getElementById('verdictLoading').classList.remove('hidden');
    document.getElementById('verdictLoading').classList.add('flex');
    const verdictDisplay = document.getElementById('verdictDisplay');
    verdictDisplay.classList.add('hidden');
    verdictDisplay.innerHTML = '';
    const submitBtn = document.getElementById('submitCodeBtn');
    submitBtn.disabled = true;

    fetch(API_BASE_URL + '/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            problemId: currentProblemId,
            code: code,
            language: lang
        })
    })
        .then(res => res.json())
        .then(submission => {
            if (!submission || !submission.id) {
                alert('Failed to submit code.');
                hideSubmissionResult();
                submitBtn.disabled = false;
                return;
            }
            pollSubmissionStatus(submission.id);
        })
        .catch(err => {
            console.error(err);
            alert('Error connecting to server.');
            hideSubmissionResult();
            submitBtn.disabled = false;
        });
}

function stopPolling() {
    if (activePollInterval) {
        clearInterval(activePollInterval);
        activePollInterval = null;
    }
    if (pollTimeout) {
        clearTimeout(pollTimeout);
        pollTimeout = null;
    }
}

function pollSubmissionStatus(submissionId) {
    stopPolling();
    let attempts = 0;
    const maxAttempts = 20;

    activePollInterval = setInterval(() => {
        attempts++;
        fetch(API_BASE_URL + '/submissions/' + submissionId)
            .then(res => res.json())
            .then(sub => {
                if (sub && sub.verdict && sub.verdict !== 'PENDING') {
                    stopPolling();
                    document.getElementById('verdictLoading').classList.add('hidden');
                    document.getElementById('submitCodeBtn').disabled = false;

                    // Display verdict with icon/color
                    displayVerdict(sub);

                    // Track in history (client-side)
                    trackSubmission(sub);

                    // Also refresh the history view if it's open
                    if (document.getElementById('view-history').classList.contains('hidden') === false) {
                        renderHistory();
                    }
                } else if (attempts >= maxAttempts) {
                    stopPolling();
                    document.getElementById('verdictLoading').classList.add('hidden');
                    document.getElementById('submitCodeBtn').disabled = false;
                    alert('Judging timed out. Please check submission status later.');
                }
            })
            .catch(err => {
                stopPolling();
                document.getElementById('verdictLoading').classList.add('hidden');
                document.getElementById('submitCodeBtn').disabled = false;
                console.error(err);
                alert('Error fetching submission status.');
            });
    }, 1500);
}

// --- NEW: Rich Verdict Display ---
function displayVerdict(submission) {
    const verdictDisplay = document.getElementById('verdictDisplay');
    verdictDisplay.classList.remove('hidden');
    verdictDisplay.innerHTML = '';

    const verdict = submission.verdict || 'UNKNOWN';
    const detail = submission.details || '';

    let icon, color, label;
    switch (verdict) {
        case 'ACCEPTED':
            icon = '✅';
            color = 'text-green-400';
            label = 'Accepted';
            break;
        case 'WRONG_ANSWER':
            icon = '❌';
            color = 'text-red-400';
            label = 'Wrong Answer';
            break;
        case 'TIME_LIMIT_EXCEEDED':
            icon = '⏱️';
            color = 'text-orange-400';
            label = 'Time Limit Exceeded';
            break;
        case 'RUNTIME_ERROR':
            icon = '⚠️';
            color = 'text-red-400';
            label = 'Runtime Error';
            break;
        case 'COMPILATION_ERROR':
            icon = '⚠️';
            color = 'text-yellow-400';
            label = 'Compilation Error';
            break;
        case 'MEMORY_LIMIT_EXCEEDED':
            icon = '💾';
            color = 'text-purple-400';
            label = 'Memory Limit Exceeded';
            break;
        default:
            icon = '❓';
            color = 'text-gray-400';
            label = verdict.replace(/_/g, ' ');
    }

    verdictDisplay.innerHTML = `
        <div class="flex items-center space-x-2 mb-4">
            <span class="text-3xl">${icon}</span>
            <h3 class="text-xl font-bold ${color}">${label}</h3>
        </div>
        ${detail ? `<p class="text-sm text-gray-400 mt-2">${detail}</p>` : ''}
        <div class="grid grid-cols-3 gap-3 text-center mt-4">
            <div class="bg-dark-800 rounded-lg p-3 border border-dark-700">
                <p class="text-xs text-gray-500 uppercase mb-1">Runtime</p>
                <p class="text-white font-mono font-semibold">${submission.executionTime || 0} ms</p>
            </div>
            <div class="bg-dark-800 rounded-lg p-3 border border-dark-700">
                <p class="text-xs text-gray-500 uppercase mb-1">Memory</p>
                <p class="text-white font-mono font-semibold">${submission.memoryUsed || 0} MB</p>
            </div>
            <div class="bg-dark-800 rounded-lg p-3 border border-dark-700">
                <p class="text-xs text-gray-500 uppercase mb-1">Tests</p>
                <p class="text-white font-mono font-semibold">${verdict === 'ACCEPTED' ? 'All Passed' : '--'}</p>
            </div>
        </div>
    `;
}

// --- SUBMISSION HISTORY (client-side) ---
function trackSubmission(submission) {
    const username = localStorage.getItem('username');
    if (!username) return;

    // Need problem title – fetch it or use currentProblemId
    // We'll fetch the problem title asynchronously and then store.
    // But to avoid blocking, we can store with the problem ID and later enrich.
    // Let's store the problem ID and title if available.
    const historyKey = 'codejudge_history_' + username;
    let history = JSON.parse(localStorage.getItem(historyKey) || '[]');

    // Try to get problem title from the current solve view
    const titleEl = document.getElementById('solveTitle');
    const problemTitle = titleEl ? titleEl.textContent : 'Problem #' + currentProblemId;

    const entry = {
        problemId: currentProblemId,
        problemTitle: problemTitle,
        language: document.getElementById('solveLanguageSelect').value,
        verdict: submission.verdict,
        executionTime: submission.executionTime || 0,
        memoryUsed: submission.memoryUsed || 0,
        timestamp: new Date().toISOString()
    };

    history.unshift(entry); // newest first
    // Keep only last 50 entries
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem(historyKey, JSON.stringify(history));
}

function renderHistory() {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;
    const username = localStorage.getItem('username');
    if (!username) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-400">Please login to see history.</td></tr>';
        return;
    }
    const historyKey = 'codejudge_history_' + username;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-400">No submissions yet.</td></tr>';
        return;
    }

    let html = '';
    for (const entry of history) {
        const verdictLabel = entry.verdict.replace(/_/g, ' ');
        const colorClass = entry.verdict === 'ACCEPTED' ? 'text-green-400' :
            entry.verdict === 'WRONG_ANSWER' ? 'text-red-400' :
                entry.verdict === 'TIME_LIMIT_EXCEEDED' ? 'text-orange-400' :
                    entry.verdict === 'RUNTIME_ERROR' ? 'text-red-400' :
                        entry.verdict === 'COMPILATION_ERROR' ? 'text-yellow-400' :
                            entry.verdict === 'MEMORY_LIMIT_EXCEEDED' ? 'text-purple-400' : 'text-gray-400';
        html += `<tr>`;
        html += `<td class="p-3 text-white">${entry.problemTitle || 'Unknown'}</td>`;
        html += `<td class="p-3 text-gray-300">${entry.language || 'N/A'}</td>`;
        html += `<td class="p-3 font-semibold ${colorClass}">${verdictLabel}</td>`;
        html += `<td class="p-3 text-gray-300">${entry.executionTime || 0} ms</td>`;
        html += `<td class="p-3 text-gray-300">${entry.memoryUsed || 0} MB</td>`;
        html += `<td class="p-3 text-gray-400 text-sm">${new Date(entry.timestamp).toLocaleString()}</td>`;
        html += `</tr>`;
    }
    tbody.innerHTML = html;
}

function clearHistory() {
    if (!confirm('Clear all submission history?')) return;
    const username = localStorage.getItem('username');
    if (!username) return;
    const historyKey = 'codejudge_history_' + username;
    localStorage.removeItem(historyKey);
    renderHistory();
}

// --- ORIGINAL FUNCTIONS (createProblem, etc.) are kept, but we've added edit/delete ---
// The createProblem function is replaced by handleProblemSubmit; we keep it for reference but not used.
// We'll keep the old createProblem for safety but it's not used.
async function createProblem() {
    // This is now replaced by handleProblemSubmit; keep empty to avoid conflicts.
    // We'll call handleProblemSubmit from the form.
}