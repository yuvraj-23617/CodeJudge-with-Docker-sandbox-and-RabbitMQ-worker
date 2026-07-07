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
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n'
};

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }});

// --- MONACO EDITOR SETUP ---
function initMonaco() {
    const container = document.getElementById('monacoEditorContainer');
    if (!container) return;

    if (!window.monaco) {
        if (!monacoLoadStarted) {
            monacoLoadStarted = true;
            require(['vs/editor/editor.main'], initMonaco);
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

    setTimeout(() => { if (monacoEditor) monacoEditor.layout(); }, 100);
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
            initMonaco();
        } else {
            monacoEditor.layout();
        }

        loadSolveView(problemId);
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
        document.getElementById('editorFileLabel').textContent = fileNameMap.python;

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
    document.getElementById('verdictAccepted').classList.add('hidden');
    document.getElementById('verdictFailed').classList.add('hidden');
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

function changeEditorLanguage(lang) {
    const fileLabel = document.getElementById('editorFileLabel');
    if (fileLabel) fileLabel.textContent = fileNameMap[lang] || 'solution.txt';
    if (monacoEditor && window.monaco) {
        const model = monacoEditor.getModel();
        if (model) {
            monaco.editor.setModelLanguage(model, languageMap[lang] || 'plaintext');
        }
    }
}

// --- ROUTING & AUTH GUARDS ---
function checkAuthAndRoute() {
    const hash = window.location.hash.substring(1) || 'home';
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if ((hash === 'problems' || hash.startsWith('solve/') || hash === 'admin') && !username) {
        alert('Please login to access this page.');
        window.location.hash = 'login';
        return;
    }
    if (hash === 'admin' && role !== 'ADMIN') {
        alert('Access Denied: Admins only!');
        window.location.hash = 'problems';
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
        dynamicNavLinks.innerHTML += '<a href="#problems" class="hover:text-blue-300 transition font-medium">Problems</a>';
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

// --- PROBLEM MANAGEMENT ---
async function loadProblems() {
    const tbody = document.getElementById('problemsTableBody');
    tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400"><div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-400 border-t-transparent"></div></td></tr>';
    try {
        const res = await fetch(API_BASE_URL + '/problems');
        const problems = await res.json();
        if (problems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">No problems yet.</td></tr>';
            return;
        }
        let html = '';
        for (const p of problems) {
            const colorClass = p.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                (p.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300');
            html += `<tr class="hover:bg-dark-700 transition cursor-pointer" onclick="window.location.hash='solve/${p.id}'">`;
            html += `<td class="p-4 text-gray-400">—</td>`;
            html += `<td class="p-4 font-medium text-white">${p.title}</td>`;
            html += `<td class="p-4"><span class="px-3 py-1 rounded-full text-xs font-semibold ${colorClass}">${p.difficulty}</span></td>`;
            html += `<td class="p-4"><button class="text-blue-400 hover:text-blue-300 text-sm font-semibold">Solve</button></td>`;
            html += `</tr>`;
        }
        tbody.innerHTML = html;
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-400">Failed to load problems.</td></tr>';
    }
}

async function createProblem() {
    try {
        const res = await fetch(API_BASE_URL + '/problems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: document.getElementById('probTitle').value,
                description: document.getElementById('probDesc').value,
                difficulty: document.getElementById('probDiff').value,
                constraints: document.getElementById('probConst').value,
                sampleInput: document.getElementById('probIn').value,
                sampleOutput: document.getElementById('probOut').value,
                testCases: []
            })
        });
        if (res.ok) {
            alert('Problem created successfully!');
            document.querySelector('#view-admin form:first-of-type').reset();
        } else {
            alert('Failed to create problem.');
        }
    } catch (e) {
        alert('Server error.');
    }
}

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

// --- ADMIN CLEANUP ---
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
    } catch (e) { alert('Error: ' + e.message); }
}

// --- SUBMISSION FLOW ---
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
    document.getElementById('verdictAccepted').classList.add('hidden');
    document.getElementById('verdictFailed').classList.add('hidden');
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
    const maxAttempts = 20; // 20 * 1.5s = 30s

    activePollInterval = setInterval(() => {
        attempts++;
        fetch(API_BASE_URL + '/submissions/' + submissionId)
            .then(res => res.json())
            .then(sub => {
                if (sub && sub.verdict && sub.verdict !== 'PENDING') {
                    stopPolling();
                    document.getElementById('verdictLoading').classList.add('hidden');
                    document.getElementById('submitCodeBtn').disabled = false;

                    if (sub.verdict === 'ACCEPTED') {
                        document.getElementById('verdictAccepted').classList.remove('hidden');
                        document.getElementById('statRuntime').textContent = (sub.executionTime || 0) + ' ms';
                        document.getElementById('statMemory').textContent = (sub.memoryUsed || 0) + ' MB';
                        document.getElementById('statTestCases').textContent = 'All Passed';
                    } else {
                        document.getElementById('verdictFailed').classList.remove('hidden');
                        const failedTitle = sub.verdict.replace(/_/g, ' ');
                        document.querySelector('#verdictFailed h3').textContent = failedTitle;
                        // Optionally show more details if backend provides
                        const detail = document.getElementById('verdictFailedDetail');
                        if (detail) detail.textContent = sub.details || 'Review your logic and try again.';
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